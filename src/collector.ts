import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";
import type { StatsCache, CostCache, HistoryEntry, CliArgs, SessionEntry, ToolUse } from "./types";

const CLAUDE_DIR = join(homedir(), ".claude");

export async function loadStatsCache(): Promise<StatsCache> {
  const path = join(CLAUDE_DIR, "stats-cache.json");
  const content = await readFile(path, "utf-8");
  return JSON.parse(content);
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
  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999); // 終了日の最後まで含める

  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= fromDate && itemDate <= toDate;
  });
}

// 日付文字列の範囲でhistoryをフィルタリング
export function filterHistoryByDateRange(
  history: HistoryEntry[],
  from: string,
  to: string
): HistoryEntry[] {
  const fromDate = new Date(from).getTime();
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);
  const toTime = toDate.getTime();

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
  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

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
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
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
  const fromTime = new Date(from).getTime();
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);
  const toTime = toDate.getTime();

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
