import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";
import { toLocalDateStr, parseLocalDate, endOfLocalDate } from "./dates";
import type { StatsCache, CostCache, HistoryEntry, CliArgs, SessionEntry, ToolUse, TokenUsage } from "./types";

const CLAUDE_DIR = join(homedir(), ".claude");

export async function loadStatsCache(): Promise<StatsCache> {
  const path = join(CLAUDE_DIR, "stats-cache.json");
  try {
    const content = await readFile(path, "utf-8");
    return JSON.parse(content);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    // stats-cache.json が無い環境（新しい PC など）は空のキャッシュから始め、
    // 日別の件数は supplementDailyActivity が JSONL から補う
    return {
      version: 0,
      lastComputedDate: "1970-01-01",
      dailyActivity: [],
      dailyModelTokens: [],
      modelUsage: {},
      totalSessions: 0,
      totalMessages: 0,
      longestSession: { sessionId: "", duration: 0, messageCount: 0, timestamp: "" },
      firstSessionDate: "",
      hourCounts: {},
    };
  }
}

export async function loadCostCache(): Promise<CostCache> {
  const path = join(CLAUDE_DIR, "cost-cache.json");
  const content = await readFile(path, "utf-8");
  return JSON.parse(content);
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  const path = join(CLAUDE_DIR, "history.jsonl");
  const content = await readFile(path, "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  return lines.map((line) => JSON.parse(line));
}

export async function loadProjectSessions(
  projectName: string
): Promise<string[]> {
  const projectDir = join(CLAUDE_DIR, "projects", projectName);
  try {
    const files = await readdir(projectDir);
    return files.filter((f) => f.endsWith(".jsonl"));
  } catch {
    return [];
  }
}

export async function listProjects(): Promise<string[]> {
  const projectsDir = join(CLAUDE_DIR, "projects");
  try {
    const dirs = await readdir(projectsDir);
    return dirs;
  } catch {
    return [];
  }
}

// 日付範囲でフィルタリング
export function filterByDateRange<T extends { date: string }>(
  data: T[],
  from: string,
  to: string
): T[] {
  const fromDate = parseLocalDate(from);
  const toDate = endOfLocalDate(to); // 終了日の最後まで含める

  return data.filter((item) => {
    const itemDate = parseLocalDate(item.date);
    return itemDate >= fromDate && itemDate <= toDate;
  });
}

// 日付文字列の範囲でhistoryをフィルタリング
export function filterHistoryByDateRange(
  history: HistoryEntry[],
  from: string,
  to: string
): HistoryEntry[] {
  const fromDate = parseLocalDate(from).getTime();
  const toTime = endOfLocalDate(to).getTime();

  return history.filter((entry) => {
    return entry.timestamp >= fromDate && entry.timestamp <= toTime;
  });
}

// コスト計算（期間指定）
export function calculateCostForPeriod(
  costCache: CostCache,
  from: string,
  to: string
): number {
  const fromDate = parseLocalDate(from);
  const toDate = endOfLocalDate(to);

  let total = 0;
  const sessions = costCache._sessions;

  for (const [, session] of Object.entries(sessions)) {
    if (typeof session === "object" && session.date && session.cost) {
      const sessionDate = new Date(session.date);
      if (sessionDate >= fromDate && sessionDate <= toDate) {
        total += session.cost;
      }
    }
  }

  return total;
}

// CLI引数から日付範囲を取得
export function parseDateRange(args: CliArgs): { from: string; to: string } {
  if (args.from && args.to) {
    return { from: args.from, to: args.to };
  }

  if (args.month) {
    // YYYY-MM形式
    const [year, month] = args.month.split("-").map(Number);
    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const to = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;
    return { from, to };
  }

  if (args.year) {
    return { from: `${args.year}-01-01`, to: `${args.year}-12-31` };
  }

  // デフォルト: 過去30日
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);

  return {
    from: toLocalDateStr(from),
    to: toLocalDateStr(to),
  };
}

// CLI引数をパース
export function parseCliArgs(args: string[]): CliArgs {
  const result: CliArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--from":
        result.from = nextArg;
        i++;
        break;
      case "--to":
        result.to = nextArg;
        i++;
        break;
      case "--month":
        result.month = nextArg;
        i++;
        break;
      case "--year":
        result.year = nextArg;
        i++;
        break;
      case "--output":
      case "-o":
        result.output = nextArg;
        i++;
        break;
      case "--lang":
      case "-l":
        result.lang = nextArg;
        i++;
        break;
      // AI生成モード用オプション
      case "--analyze-only":
        result.analyzeOnly = true;
        break;
      case "--roast":
        if (!result.roast) result.roast = [];
        result.roast.push(nextArg);
        i++;
        break;
      case "--hype":
        if (!result.hype) result.hype = [];
        result.hype.push(nextArg);
        i++;
        break;
      case "--summary":
        result.summary = nextArg;
        i++;
        break;
    }
  }

  return result;
}

// 全プロジェクトのセッションファイルを読み込み
export async function loadAllSessionEntries(
  from: string,
  to: string
): Promise<SessionEntry[]> {
  const projectsDir = join(CLAUDE_DIR, "projects");
  const fromTime = parseLocalDate(from).getTime();
  const toTime = endOfLocalDate(to).getTime();

  const entries: SessionEntry[] = [];

  try {
    const projectDirs = await readdir(projectsDir, { withFileTypes: true });

    for (const projectDir of projectDirs) {
      if (!projectDir.isDirectory()) continue;

      const projectPath = join(projectsDir, projectDir.name);
      try {
        const files = await readdir(projectPath);
        const jsonlFiles = files.filter((f) => f.endsWith(".jsonl"));

        for (const file of jsonlFiles) {
          const filePath = join(projectPath, file);
          try {
            const content = await readFile(filePath, "utf-8");
            const lines = content.trim().split("\n").filter(Boolean);

            for (const line of lines) {
              try {
                const entry: SessionEntry = JSON.parse(line);

                // timestampでフィルタリング
                if (entry.timestamp) {
                  const entryTime = new Date(entry.timestamp).getTime();
                  if (entryTime >= fromTime && entryTime <= toTime) {
                    entries.push(entry);
                  }
                } else {
                  // timestampがない場合は含める（後でフィルタ可能）
                  entries.push(entry);
                }
              } catch {
                // JSONパースエラーは無視
              }
            }
          } catch {
            // ファイル読み込みエラーは無視
          }
        }
      } catch {
        // プロジェクトディレクトリ読み込みエラーは無視
      }
    }
  } catch {
    // projectsディレクトリがない場合は空配列
  }

  return entries;
}

// セッションエントリからツール使用情報を抽出
export function extractToolUses(entries: SessionEntry[]): ToolUse[] {
  const toolUses: ToolUse[] = [];

  for (const entry of entries) {
    // type: "assistant" のエントリのみ処理
    if (entry.type !== "assistant") continue;

    const content = entry.message?.content;
    if (!Array.isArray(content)) continue;

    for (const item of content) {
      if (item.type === "tool_use" && item.name && item.input?.file_path) {
        // Write, Edit, Read のツール使用を抽出
        if (["Write", "Edit", "Read"].includes(item.name)) {
          toolUses.push({
            name: item.name,
            filePath: item.input.file_path,
            timestamp: entry.timestamp,
          });
        }
      }
    }
  }

  return toolUses;
}

// API の単価（USD / 100 万トークン）。MAX プランの実際の支払いではなく、API で払った場合の目安
// input / output / cacheRead。cache の書き込みは 5 分 TTL が input の 1.25 倍、1 時間 TTL が 2 倍
const PRICING: Record<string, { input: number; output: number; cacheRead: number }> = {
  "claude-fable-5-1": { input: 10, output: 50, cacheRead: 0.25 },
  "claude-mythos-5-1": { input: 10, output: 50, cacheRead: 0.25 },
  "claude-fable-5": { input: 10, output: 50, cacheRead: 1 },
  "claude-opus-5-5": { input: 4, output: 20, cacheRead: 0.2 },
  "claude-opus-5": { input: 5, output: 25, cacheRead: 0.5 },
  "claude-opus-4-8": { input: 5, output: 25, cacheRead: 0.5 },
  "claude-opus-4-7": { input: 5, output: 25, cacheRead: 0.5 },
  "claude-opus-4-6": { input: 5, output: 25, cacheRead: 0.5 },
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.2 },
  "claude-sonnet-5": { input: 2, output: 10, cacheRead: 0.2 },
  "claude-sonnet-4-6": { input: 3, output: 15, cacheRead: 0.3 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheRead: 0.01 },
  "claude-haiku-4-5": { input: 1, output: 5, cacheRead: 0.1 },
};

// "claude-opus-5[1m]" のような接尾辞を落としてから単価を引く
export function normalizeModel(model: string): string {
  return model.replace(/\[.*\]$/, "");
}

export function estimateCostUSD(model: string, u: TokenUsage): number {
  const p = PRICING[normalizeModel(model)];
  if (!p) return 0;
  const write = u.cache_creation_input_tokens ?? 0;
  const write1h = u.cache_creation?.ephemeral_1h_input_tokens ?? 0;
  const write5m = u.cache_creation ? (u.cache_creation.ephemeral_5m_input_tokens ?? 0) : write;
  return (
    ((u.input_tokens ?? 0) * p.input +
      (u.output_tokens ?? 0) * p.output +
      (u.cache_read_input_tokens ?? 0) * p.cacheRead +
      write5m * p.input * 1.25 +
      write1h * p.input * 2) /
    1_000_000
  );
}

// JSONLからdailyActivityを補完（stats-cacheに欠けている日を追加）
export function supplementDailyActivity(
  statsCache: StatsCache,
  sessionEntries: SessionEntry[],
  to: string
): StatsCache {
  // stats-cacheの最終計算日
  const lastComputedDate = statsCache.lastComputedDate;
  const toDateStr = toLocalDateStr(parseLocalDate(to));

  // lastComputedDateが今日以降なら補完不要
  if (lastComputedDate >= toDateStr) {
    return statsCache;
  }

  // 既存の日付をSetに格納（O(1)ルックアップ用）
  const existingDates = new Set(statsCache.dailyActivity.map(d => d.date));

  // sessionEntriesを日別に集計（lastComputedDateより後の日のみ）
  const dailyData: Map<string, {
    messages: number;
    sessions: Set<string>;
    tools: number;
    tokensByModel: Record<string, number>;
    cost: number;
  }> = new Map();
  // 1 つの応答はコンテンツのブロックごとに別の行になり、同じ usage が繰り返される。message.id で 1 回だけ数える
  const countedMessages = new Set<string>();
  // stats-cache.json に時間帯の集計が無いときだけ、JSONL から数える（現地時間）
  const fillHours = Object.keys(statsCache.hourCounts ?? {}).length === 0;
  const hourCounts: Record<string, number> = { ...(statsCache.hourCounts ?? {}) };

  for (const entry of sessionEntries) {
    if (!entry.timestamp) continue;

    const entryDate = new Date(entry.timestamp);
    const dateStr = toLocalDateStr(entryDate);

    // 既にstats-cacheにある日はスキップ（冪等性）
    if (existingDates.has(dateStr)) continue;

    // lastComputedDate以前の日もスキップ
    if (dateStr <= lastComputedDate) continue;

    // toDateより後の日もスキップ
    if (dateStr > toDateStr) continue;

    if (!dailyData.has(dateStr)) {
      dailyData.set(dateStr, { messages: 0, sessions: new Set(), tools: 0, tokensByModel: {}, cost: 0 });
    }

    const data = dailyData.get(dateStr)!;

    if (entry.sessionId) data.sessions.add(entry.sessionId);

    if (fillHours && entry.type === "user") {
      const hour = String(entryDate.getHours());
      hourCounts[hour] = (hourCounts[hour] ?? 0) + 1;
    }

    // トークン数と費用（assistant の usage）
    const msg = entry.message;
    if (entry.type === "assistant" && msg?.usage && msg.model && msg.model !== "<synthetic>") {
      const key = msg.id ?? entry.requestId;
      if (!key || !countedMessages.has(key)) {
        if (key) countedMessages.add(key);
        const model = normalizeModel(msg.model);
        const tokens = (msg.usage.input_tokens ?? 0) + (msg.usage.output_tokens ?? 0);
        data.tokensByModel[model] = (data.tokensByModel[model] ?? 0) + tokens;
        data.cost += estimateCostUSD(model, msg.usage);
      }
    }

    // メッセージカウント（user/assistant両方カウント）
    if (entry.type === "user" || entry.type === "assistant") {
      data.messages++;
    }

    // ツール使用カウント
    if (entry.type === "assistant" && entry.message?.content) {
      for (const item of entry.message.content) {
        if (item.type === "tool_use") {
          data.tools++;
        }
      }
    }
  }

  // 新しいdailyActivityを追加
  const newDailyActivity = [...statsCache.dailyActivity];
  const newDailyModelTokens = [...statsCache.dailyModelTokens];
  const dailyCostUSD: Record<string, number> = { ...(statsCache.dailyCostUSD ?? {}) };

  for (const [date, data] of dailyData) {
    newDailyActivity.push({
      date,
      messageCount: data.messages,
      sessionCount: data.sessions.size || 1, // sessionId の無い古い記録でも最低1
      toolCallCount: data.tools,
    });

    newDailyModelTokens.push({
      date,
      tokensByModel: data.tokensByModel,
    });
    dailyCostUSD[date] = data.cost;
  }

  // 日付順にソート
  newDailyActivity.sort((a, b) => a.date.localeCompare(b.date));
  newDailyModelTokens.sort((a, b) => a.date.localeCompare(b.date));

  return {
    ...statsCache,
    dailyActivity: newDailyActivity,
    dailyModelTokens: newDailyModelTokens,
    dailyCostUSD,
    hourCounts,
    lastComputedDate: toDateStr, // 補完後の最終日を更新
  };
}
