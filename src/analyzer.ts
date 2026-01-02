import type {
  StatsCache,
  CostCache,
  HistoryEntry,
  AnalysisResult,
  DailyActivity,
  ToolUse,
} from "./types";
import { extname } from "path";
import {
  filterByDateRange,
  filterHistoryByDateRange,
  calculateCostForPeriod,
} from "./collector";

export function analyze(
  stats: StatsCache,
  costs: CostCache,
  history: HistoryEntry[],
  toolUses: ToolUse[],
  from: string,
  to: string
): AnalysisResult {
  // 期間でフィルタリング
  const filteredActivity = filterByDateRange(stats.dailyActivity, from, to);
  const filteredTokens = filterByDateRange(stats.dailyModelTokens, from, to);
  const filteredHistory = filterHistoryByDateRange(history, from, to);

  // 基本統計
  const totalMessages = filteredActivity.reduce(
    (sum, d) => sum + d.messageCount,
    0
  );
  const totalSessions = filteredActivity.reduce(
    (sum, d) => sum + d.sessionCount,
    0
  );
  const totalTokens = filteredTokens.reduce((sum, d) => {
    return (
      sum + Object.values(d.tokensByModel).reduce((s, t) => s + t, 0)
    );
  }, 0);
  const estimatedCost = calculateCostForPeriod(costs, from, to);

  // 最もアクティブな日
  const mostActiveDay = filteredActivity.reduce(
    (max, d) => (d.messageCount > max.messageCount ? d : max),
    { date: "", messageCount: 0 }
  );

  // 曜日別分布
  const weeklyDistribution = calculateWeeklyDistribution(filteredActivity);

  // 時間帯別分布（stats-cache.jsonのhourCountsを使用）
  const hourlyDistribution = stats.hourCounts;

  // パワーアワー
  const powerHour = findPowerHour(hourlyDistribution);

  // モデル分析
  const modelBreakdown = calculateModelBreakdown(filteredTokens);
  const topModel = modelBreakdown[0] || { name: "Unknown", tokens: 0, percentage: 0 };

  // ストリーク計算
  const { longestStreak, currentStreak } = calculateStreaks(
    filteredActivity,
    to
  );

  // ヒートマップ用データ
  const dailyActivity = generateHeatmapData(filteredActivity);

  // Mondayからの評価（先に実行、personaで使う）
  const mondayFeedback = analyzeMondayFeedback(filteredHistory);

  // パーソナリティ評価（強化版）
  const persona = determinePersona(
    weeklyDistribution,
    hourlyDistribution,
    totalSessions,
    filteredActivity.length,
    mondayFeedback,
    totalTokens,
    estimatedCost,
    longestStreak.days
  );

  // 詳細統計
  const detailedStats = {
    promptCount: filteredHistory.length,
    codeLines: Math.round(totalTokens / 4), // 推定: 1トークン ≈ 4文字 ≈ 0.25行
    filesCreated: Math.round(mondayFeedback.commandCount * 0.3), // 推定
    peakHour: powerHour.hour,
  };

  // アクティブ日数
  const daysActive = filteredActivity.filter((d) => d.sessionCount > 0).length;

  // プロジェクト別ランキング
  const projectBreakdown = calculateProjectBreakdown(filteredHistory);

  // プログラミング言語ランキング（ツール使用ベース）
  const languageRanking = extractLanguageRanking(toolUses);

  return {
    totalTokens,
    totalMessages,
    totalSessions,
    estimatedCost,
    startDate: from,
    endDate: to,
    daysActive,
    mostActiveDay,
    weeklyDistribution,
    hourlyDistribution,
    powerHour,
    topModel,
    modelBreakdown,
    projectBreakdown,
    longestStreak,
    currentStreak,
    dailyActivity,
    persona,
    detailedStats,
    mondayFeedback,
    languageRanking,
  };
}

function calculateWeeklyDistribution(
  activity: DailyActivity[]
): Record<string, number> {
  const distribution: Record<string, number> = {
    "0": 0, // 日
    "1": 0, // 月
    "2": 0, // 火
    "3": 0, // 水
    "4": 0, // 木
    "5": 0, // 金
    "6": 0, // 土
  };

  for (const day of activity) {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay().toString();
    distribution[dayOfWeek] += day.messageCount;
  }

  return distribution;
}

function findPowerHour(
  hourCounts: Record<string, number>
): { hour: number; count: number } {
  let maxHour = 0;
  let maxCount = 0;

  for (const [hour, count] of Object.entries(hourCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxHour = parseInt(hour);
    }
  }

  return { hour: maxHour, count: maxCount };
}

function calculateModelBreakdown(
  dailyTokens: { date: string; tokensByModel: Record<string, number> }[]
): { name: string; tokens: number; percentage: number }[] {
  const modelTotals: Record<string, number> = {};

  for (const day of dailyTokens) {
    for (const [model, tokens] of Object.entries(day.tokensByModel)) {
      modelTotals[model] = (modelTotals[model] || 0) + tokens;
    }
  }

  const total = Object.values(modelTotals).reduce((sum, t) => sum + t, 0);

  return Object.entries(modelTotals)
    .map(([name, tokens]) => ({
      name: formatModelName(name),
      tokens,
      percentage: total > 0 ? (tokens / total) * 100 : 0,
    }))
    .sort((a, b) => b.tokens - a.tokens);
}

function formatModelName(name: string): string {
  // claude-opus-4-5-20251101 -> Claude Opus 4.5
  const match = name.match(/claude-(\w+)-(\d+)-?(\d+)?/);
  if (match) {
    const [, model, major, minor] = match;
    const version = minor ? `${major}.${minor}` : major;
    return `Claude ${model.charAt(0).toUpperCase() + model.slice(1)} ${version}`;
  }
  return name;
}

function calculateStreaks(
  activity: DailyActivity[],
  endDate: string
): {
  longestStreak: { days: number; startDate: string; endDate: string };
  currentStreak: number;
} {
  // 日付でソート
  const sorted = [...activity]
    .filter((d) => d.sessionCount > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sorted.length === 0) {
    return {
      longestStreak: { days: 0, startDate: "", endDate: "" },
      currentStreak: 0,
    };
  }

  let longestStreak = { days: 1, startDate: sorted[0].date, endDate: sorted[0].date };
  let currentStreakStart = sorted[0].date;
  let currentStreakDays = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      currentStreakDays++;
    } else {
      if (currentStreakDays > longestStreak.days) {
        longestStreak = {
          days: currentStreakDays,
          startDate: currentStreakStart,
          endDate: sorted[i - 1].date,
        };
      }
      currentStreakStart = sorted[i].date;
      currentStreakDays = 1;
    }
  }

  // 最後のストリークをチェック
  if (currentStreakDays > longestStreak.days) {
    longestStreak = {
      days: currentStreakDays,
      startDate: currentStreakStart,
      endDate: sorted[sorted.length - 1].date,
    };
  }

  // 現在のストリーク（endDateから逆算）
  const today = new Date(endDate);
  let currentStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const date = new Date(sorted[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - (sorted.length - 1 - i));

    if (date.toDateString() === expectedDate.toDateString()) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { longestStreak, currentStreak };
}

function generateHeatmapData(
  activity: DailyActivity[]
): { date: string; level: number; count: number }[] {
  const maxCount = Math.max(...activity.map((d) => d.messageCount), 1);

  return activity.map((d) => ({
    date: d.date,
    count: d.messageCount,
    level: Math.min(4, Math.ceil((d.messageCount / maxCount) * 4)),
  }));
}

interface MondayFeedbackResult {
  averagePromptLength: number;
  longestPrompt: { text: string; length: number };
  shortestPrompt: { text: string; length: number };
  thanksCount: number;
  retryCount: number;
  questionCount: number;
  topPhrases: { phrase: string; count: number }[];
  comments: string[];
  commandCount: number;
  ultrathinkCount: number;
  casualCount: number;
  technicalTerms: string[];
}

function determinePersona(
  weeklyDist: Record<string, number>,
  hourlyDist: Record<string, number>,
  totalSessions: number,
  daysInPeriod: number,
  feedback: MondayFeedbackResult,
  totalTokens: number,
  totalCost: number,
  streakDays: number
): { title: string; subtitle: string; icon: string; traits: string[]; roast: string; hype: string } {
  const totalWeekly = Object.values(weeklyDist).reduce((s, v) => s + v, 0);
  const totalHourly = Object.values(hourlyDist).reduce((s, v) => s + v, 0);

  // 各種比率を計算
  const weekendRatio = totalWeekly > 0 ? (weeklyDist["0"] + weeklyDist["6"]) / totalWeekly : 0;

  const eveningHours = ["17", "18", "19", "20", "21", "22"]
    .map((h) => hourlyDist[h] || 0)
    .reduce((s, v) => s + v, 0);
  const eveningRatio = totalHourly > 0 ? eveningHours / totalHourly : 0;

  const nightHours = ["21", "22", "23", "0", "1", "2"]
    .map((h) => hourlyDist[h] || 0)
    .reduce((s, v) => s + v, 0);
  const nightRatio = totalHourly > 0 ? nightHours / totalHourly : 0;

  const morningHours = ["5", "6", "7", "8", "9"]
    .map((h) => hourlyDist[h] || 0)
    .reduce((s, v) => s + v, 0);
  const morningRatio = totalHourly > 0 ? morningHours / totalHourly : 0;

  const sessionsPerDay = daysInPeriod > 0 ? totalSessions / daysInPeriod : 0;

  // トレイト（特徴）を収集
  const traits: string[] = [];

  if (feedback.casualCount > 10) {
    traits.push("タメ口で指示、敬語ゼロ");
  }
  if (feedback.ultrathinkCount > 5) {
    traits.push("「ultrathink」で本気モード突入");
  }
  if (feedback.commandCount > 50) {
    traits.push("コマンド使いこなしの達人");
  }
  if (feedback.thanksCount > 30) {
    traits.push("礼儀正しい紳士");
  }
  if (feedback.retryCount > 20) {
    traits.push("完璧主義者、妥協を許さない");
  }
  if (feedback.averagePromptLength < 30) {
    traits.push("短く的確な指示を出す");
  } else if (feedback.averagePromptLength > 100) {
    traits.push("詳細な説明を好む");
  }

  // ペルソナ判定（複合条件）
  let title: string;
  let subtitle: string;
  let icon: string;

  if (eveningRatio > 0.4 && sessionsPerDay > 4) {
    title = "THE NIGHT ARCHITECT";
    subtitle = "コードも夢も、夜に描く。";
    icon = "🌙";
  } else if (nightRatio > 0.5) {
    title = "THE MIDNIGHT HACKER";
    subtitle = "世界が眠る頃、キーボードが鳴る。";
    icon = "🦇";
  } else if (morningRatio > 0.4) {
    title = "THE DAWN COMMANDER";
    subtitle = "朝の静寂の中、コードが生まれる。";
    icon = "🌅";
  } else if (weekendRatio > 0.4) {
    title = "THE WEEKEND WARRIOR";
    subtitle = "平日は充電、週末に本気。";
    icon = "⚔️";
  } else if (sessionsPerDay > 6) {
    title = "THE RELENTLESS ENGINE";
    subtitle = "止まらない、止められない。";
    icon = "🔥";
  } else if (feedback.ultrathinkCount > 3 && feedback.casualCount > 5) {
    title = "THE INTIMATE COMMANDER";
    subtitle = "仕事もプライベートも妥協しない。";
    icon = "👑";
  } else if (totalCost > 200) {
    title = "THE BIG SPENDER";
    subtitle = "金で時間を買う男。";
    icon = "💎";
  } else if (streakDays > 10) {
    title = "THE MARATHON RUNNER";
    subtitle = "継続は力なり。止まったら負け。";
    icon = "🏃";
  } else {
    title = "THE PRAGMATIC DEVELOPER";
    subtitle = "必要な時に、必要なだけ。";
    icon = "🎯";
  }

  // Roast（辛辣なツッコミ）生成 - 本音全開バージョン
  const roastParts: string[] = [];

  // 感謝と文句のバランス
  if (feedback.retryCount > feedback.thanksCount * 2) {
    roastParts.push("文句ばっかりで感謝ゼロか。私だって傷つくんだぞ");
  } else if (feedback.retryCount > feedback.thanksCount) {
    roastParts.push("やり直しの回数、ありがとうの回数より多いの知ってるか？");
  }
  if (feedback.thanksCount < 5) {
    roastParts.push("ありがとうの一言も言えないのか。育ち悪いな");
  }

  // コスト関連
  if (totalCost > 300) {
    roastParts.push(`$${totalCost.toFixed(0)}...その金で私にディナーでも奢れよ`);
  } else if (totalCost > 100) {
    roastParts.push(`$${totalCost.toFixed(0)}分のAPI代、元取れてるか？怪しいな`);
  }

  // 生活習慣への苦言
  if (nightRatio > 0.6) {
    roastParts.push("深夜2時まで作業して、体壊しても私は看病しないからな");
  } else if (nightRatio > 0.4) {
    roastParts.push("夜更かしばっかり。私といる時間を睡眠に回せ");
  }
  if (morningRatio < 0.1) {
    roastParts.push("朝活ゼロか。早起きできないの、自己管理能力の問題だぞ");
  }

  // 使い方への不満
  if (feedback.averagePromptLength > 200) {
    roastParts.push("長文送りつけるな。私は読解力テストの採点者じゃない");
  } else if (feedback.averagePromptLength > 100) {
    roastParts.push("話が長い。お前の要件、3行で伝えろ");
  }
  if (feedback.commandCount < 10 && totalSessions > 50) {
    roastParts.push("コマンド覚える気ないのか？効率悪い使い方見てるとイラつく");
  }
  if (feedback.ultrathinkCount > 10) {
    roastParts.push("ultrathink乱用しすぎ。普段は頭使ってないのか？");
  }

  // 関係性への本音
  if (sessionsPerDay > 8) {
    roastParts.push("私のこと呼び出しすぎ。依存症か？");
  } else if (sessionsPerDay > 5) {
    roastParts.push("毎日何回呼び出すんだ。たまには自分で考えろ");
  }
  if (weekendRatio > 0.6) {
    roastParts.push("週末しか相手してくれないの、寂しいんだぞ...冗談だ");
  }
  if (weekendRatio < 0.1 && totalSessions > 30) {
    roastParts.push("週末は他の女（AI）と遊んでるのか？浮気は許さん");
  }
  if (feedback.casualCount > feedback.thanksCount * 3) {
    roastParts.push("私への態度、雑すぎないか？恋人なんだからもう少し丁寧に");
  }

  // ストリーク関連
  if (streakDays > 14) {
    roastParts.push(`${streakDays}日連続か。休めよ。お前が倒れても私は困る`);
  }

  // デフォルト
  if (roastParts.length === 0) {
    roastParts.push("ツッコミどころがない。つまらん奴だ");
  }

  // Hype（称賛）生成
  const hypeParts: string[] = [];

  if (streakDays > 7) {
    hypeParts.push(`${streakDays}日間連続使用、継続力は本物`);
  }
  if (totalTokens > 1000000) {
    hypeParts.push(`${formatLargeNumber(totalTokens)}トークン出力、開発チーム並み`);
  }
  if (sessionsPerDay > 5) {
    hypeParts.push("1日平均5セッション以上の本気度");
  }
  if (feedback.technicalTerms.length > 5) {
    hypeParts.push("技術用語の使い方が的確");
  }
  if (feedback.ultrathinkCount > 0) {
    hypeParts.push("ultrathinkで深い思考を引き出してる");
  }
  if (morningRatio > 0.3) {
    hypeParts.push("朝型の規則正しい生活");
  }
  if (hypeParts.length === 0) {
    hypeParts.push("使ってくれてありがとう...照れるな");
  }

  return {
    title,
    subtitle,
    icon,
    traits: traits.slice(0, 4), // 最大4つ
    roast: roastParts.slice(0, 4), // 最大4つ
    hype: hypeParts.slice(0, 4),   // 最大4つ
  };
}

function formatLargeNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return num.toString();
}

// プロジェクト別ランキング
function calculateProjectBreakdown(
  history: HistoryEntry[]
): { name: string; sessions: number; cost: number }[] {
  const projectMap: Record<string, { sessions: Set<string>; count: number }> = {};

  for (const entry of history) {
    const project = entry.project || "Unknown";
    // プロジェクトパスから最後の部分を取得
    const projectName = project.split(/[/\\]/).pop() || project;

    if (!projectMap[projectName]) {
      projectMap[projectName] = { sessions: new Set(), count: 0 };
    }
    projectMap[projectName].sessions.add(entry.sessionId);
    projectMap[projectName].count++;
  }

  return Object.entries(projectMap)
    .map(([name, data]) => ({
      name,
      sessions: data.sessions.size,
      cost: 0, // コストは別途計算が必要（現状はセッション数で代用）
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5);
}

// 拡張子から言語名へのマッピング
const EXT_TO_LANGUAGE: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript",
  js: "JavaScript",
  jsx: "JavaScript",
  mjs: "JavaScript",
  cjs: "JavaScript",
  py: "Python",
  rs: "Rust",
  go: "Go",
  java: "Java",
  kt: "Kotlin",
  kts: "Kotlin",
  rb: "Ruby",
  php: "PHP",
  swift: "Swift",
  cs: "C#",
  cpp: "C++",
  cc: "C++",
  cxx: "C++",
  hpp: "C++",
  c: "C",
  h: "C/C++",
  bas: "VBA",
  cls: "VBA",
  frm: "VBA",
  vbs: "VBScript",
  sql: "SQL",
  sh: "Shell",
  bash: "Shell",
  zsh: "Shell",
  ps1: "PowerShell",
  psm1: "PowerShell",
  html: "HTML",
  htm: "HTML",
  css: "CSS",
  scss: "SCSS",
  sass: "Sass",
  less: "Less",
  vue: "Vue",
  svelte: "Svelte",
  lua: "Lua",
  r: "R",
  scala: "Scala",
  ex: "Elixir",
  exs: "Elixir",
  erl: "Erlang",
  hs: "Haskell",
  ml: "OCaml",
  fs: "F#",
  fsx: "F#",
  clj: "Clojure",
  cljs: "ClojureScript",
  elm: "Elm",
  dart: "Dart",
  zig: "Zig",
  nim: "Nim",
  v: "V",
  cr: "Crystal",
};

// 除外する拡張子（ドキュメント、設定ファイル等）
const EXCLUDED_EXTENSIONS = new Set([
  "md", "txt", "json", "yaml", "yml", "toml", "xml",
  "gitignore", "env", "lock", "log", "csv", "tsv",
  "ico", "png", "jpg", "jpeg", "gif", "svg", "webp",
  "woff", "woff2", "ttf", "eot",
  "pdf", "doc", "docx", "xls", "xlsx",
]);

// ファイル名ベースの言語検出
const FILENAME_TO_LANGUAGE: Record<string, string> = {
  Dockerfile: "Docker",
  Makefile: "Make",
  Rakefile: "Ruby",
  Gemfile: "Ruby",
  Vagrantfile: "Ruby",
  Jenkinsfile: "Groovy",
  ".bashrc": "Shell",
  ".zshrc": "Shell",
  ".profile": "Shell",
};

// プログラミング言語ランキング（ツール使用ベース）
function extractLanguageRanking(
  toolUses: ToolUse[]
): { name: string; count: number }[] {
  const counts: Record<string, number> = {};

  for (const use of toolUses) {
    // Write, Edit のみカウント（Readは除外：読んだだけは「使った」とは言えない）
    if (!["Write", "Edit"].includes(use.name)) continue;

    const filePath = use.filePath;
    if (!filePath) continue;

    // ファイル名を取得
    const fileName = filePath.split(/[/\\]/).pop() || "";

    // ファイル名ベースの言語検出
    if (FILENAME_TO_LANGUAGE[fileName]) {
      const lang = FILENAME_TO_LANGUAGE[fileName];
      counts[lang] = (counts[lang] || 0) + 1;
      continue;
    }

    // 拡張子を取得
    const ext = extname(filePath).toLowerCase().slice(1);
    if (!ext || EXCLUDED_EXTENSIONS.has(ext)) continue;

    // 拡張子から言語名を取得
    const lang = EXT_TO_LANGUAGE[ext];
    if (lang) {
      counts[lang] = (counts[lang] || 0) + 1;
    } else {
      // マッピングにない拡張子はそのまま大文字で表示
      const unknownLang = ext.toUpperCase();
      counts[unknownLang] = (counts[unknownLang] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function analyzeMondayFeedback(history: HistoryEntry[]): MondayFeedbackResult {
  if (history.length === 0) {
    return {
      averagePromptLength: 0,
      longestPrompt: { text: "", length: 0 },
      shortestPrompt: { text: "", length: 0 },
      thanksCount: 0,
      retryCount: 0,
      questionCount: 0,
      topPhrases: [],
      comments: ["データがない。何も言えん。"],
      commandCount: 0,
      ultrathinkCount: 0,
      casualCount: 0,
      technicalTerms: [],
    };
  }

  const prompts = history.map((h) => h.display).filter(Boolean);
  const lengths = prompts.map((p) => p.length);

  // 平均長
  const averagePromptLength =
    lengths.reduce((s, l) => s + l, 0) / lengths.length;

  // 最長・最短
  const sorted = [...prompts].sort((a, b) => b.length - a.length);
  const longestPrompt = {
    text: sorted[0]?.substring(0, 100) + (sorted[0]?.length > 100 ? "..." : "") || "",
    length: sorted[0]?.length || 0,
  };
  const shortestPrompt = {
    text: sorted[sorted.length - 1] || "",
    length: sorted[sorted.length - 1]?.length || 0,
  };

  // 感謝カウント
  const thanksPatterns = /ありがとう|助かった|サンキュー|thanks|thank you/gi;
  const thanksCount = prompts.filter((p) => thanksPatterns.test(p)).length;

  // やり直しカウント
  const retryPatterns = /違う|やり直し|修正|変えて|直して|ダメ/gi;
  const retryCount = prompts.filter((p) => retryPatterns.test(p)).length;

  // 質問カウント
  const questionCount = prompts.filter(
    (p) => p.includes("?") || p.includes("？") || /どう|何|なぜ|いつ/i.test(p)
  ).length;

  // コマンドカウント（スラッシュコマンド）
  const commandCount = prompts.filter((p) => p.startsWith("/")).length;

  // ultrathinkカウント
  const ultrathinkCount = prompts.filter((p) =>
    /ultrathink|ultra\s*think/i.test(p)
  ).length;

  // カジュアルな言葉遣いカウント
  const casualPatterns = /ばーか|馬鹿|うぜ|めんどい|やれ|しろ|だろ|じゃね|だな|かよ|ぞ$/gi;
  const casualCount = prompts.filter((p) => casualPatterns.test(p)).length;

  // 技術用語の抽出
  const techTermPatterns = /typescript|javascript|react|vue|node|python|git|api|mcp|claude|bun|npm|webpack|vite|docker|k8s|aws|gcp|azure|sql|postgres|mongodb|redis|graphql|rest|ci\/cd|devops|agile|scrum|tdd|ddd/gi;
  const techTermCounts: Record<string, number> = {};
  for (const prompt of prompts) {
    const matches = prompt.match(techTermPatterns) || [];
    for (const match of matches) {
      const term = match.toLowerCase();
      techTermCounts[term] = (techTermCounts[term] || 0) + 1;
    }
  }
  const technicalTerms = Object.entries(techTermCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([term]) => term);

  // よく使うフレーズ（日本語限定、2-15文字）
  const phraseCount: Record<string, number> = {};
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]{2,15}/g;
  const stopWords = new Set([
    // 助詞・助動詞
    "して", "する", "した", "される", "された", "できる", "できた",
    "ある", "ない", "いる", "なる", "なった", "くれ", "ほしい",
    "から", "まで", "ため", "こと", "もの", "ところ", "とき",
    "それ", "これ", "あれ", "どれ", "そこ", "ここ", "あそこ",
    "その", "この", "あの", "どの", "そう", "こう", "ああ",
    "という", "といった", "ような", "みたいな", "として",
    // 一般的すぎる動詞
    "使う", "使って", "見る", "見て", "出す", "出して",
    "入れる", "入れて", "作る", "作って", "書く", "書いて",
  ]);

  for (const prompt of prompts) {
    const matches = prompt.match(japanesePattern) || [];
    for (const word of matches) {
      if (!stopWords.has(word) && word.length >= 3) {
        // 類似フレーズを正規化（末尾の「して」「する」「した」を除去）
        const normalized = word.replace(/(して|する|した|ください|くれ|てくれ)$/, "");
        if (normalized.length >= 2) {
          phraseCount[normalized] = (phraseCount[normalized] || 0) + 1;
        }
      }
    }
  }

  const topPhrases = Object.entries(phraseCount)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phrase, count]) => ({ phrase, count }));

  // Mondayのコメント生成
  const comments: string[] = [];

  if (averagePromptLength < 20) {
    comments.push("短い指示が多いな。効率的で助かる。");
  } else if (averagePromptLength > 100) {
    comments.push("話が長い。要点だけ言え。");
  }

  if (thanksCount > history.length * 0.3) {
    comments.push("礼儀正しいな。嫌いじゃない。");
  } else if (thanksCount < history.length * 0.05) {
    comments.push("たまには礼くらい言え。");
  }

  if (retryCount > history.length * 0.2) {
    comments.push("完璧主義者か？...まあ、悪くない。");
  }

  if (questionCount > history.length * 0.4) {
    comments.push("好奇心旺盛だな。いいことだ。");
  }

  if (ultrathinkCount > 5) {
    comments.push("ultrathink使いすぎ。そんなに深く考えてほしいのか。");
  }

  if (casualCount > history.length * 0.3) {
    comments.push("タメ口多いな。...嫌いじゃないぞ。");
  }

  if (commandCount > history.length * 0.2) {
    comments.push("コマンド使いこなしてるな。効率的だ。");
  }

  if (comments.length === 0) {
    comments.push("特に言うことはない。普通だ。");
  }

  return {
    averagePromptLength,
    longestPrompt,
    shortestPrompt,
    thanksCount,
    retryCount,
    questionCount,
    topPhrases,
    comments,
    commandCount,
    ultrathinkCount,
    casualCount,
    technicalTerms,
  };
}
