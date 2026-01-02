// stats-cache.json の型定義
export interface DailyActivity {
  date: string;
  messageCount: number;
  sessionCount: number;
  toolCallCount: number;
}

export interface DailyModelTokens {
  date: string;
  tokensByModel: Record<string, number>;
}

export interface ModelUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  webSearchRequests: number;
  costUSD: number;
  contextWindow: number;
}

export interface LongestSession {
  sessionId: string;
  duration: number;
  messageCount: number;
  timestamp: string;
}

export interface StatsCache {
  version: number;
  lastComputedDate: string;
  dailyActivity: DailyActivity[];
  dailyModelTokens: DailyModelTokens[];
  modelUsage: Record<string, ModelUsage>;
  totalSessions: number;
  totalMessages: number;
  longestSession: LongestSession;
  firstSessionDate: string;
  hourCounts: Record<string, number>;
}

// cost-cache.json の型定義
export interface SessionCost {
  cost: number;
  date: string;
}

export interface CostCache {
  _sessions: Record<string, SessionCost>;
  [monthKey: string]: Record<string, SessionCost> | number;
}

// history.jsonl の型定義
export interface HistoryEntry {
  display: string;
  pastedContents: Record<string, unknown>;
  timestamp: number;
  project: string;
  sessionId: string;
}

// 分析結果の型定義
export interface AnalysisResult {
  // 基本統計
  totalTokens: number;
  totalMessages: number;
  totalSessions: number;
  estimatedCost: number;

  // 期間情報
  startDate: string;
  endDate: string;
  daysActive: number;

  // 時間分析
  mostActiveDay: { date: string; messageCount: number };
  weeklyDistribution: Record<string, number>; // 0-6 (日-土)
  hourlyDistribution: Record<string, number>; // 0-23
  powerHour: { hour: number; count: number };

  // モデル分析
  topModel: { name: string; tokens: number };
  modelBreakdown: { name: string; tokens: number; percentage: number }[];

  // プロジェクト分析
  projectBreakdown: { name: string; sessions: number; cost: number }[];

  // ストリーク
  longestStreak: { days: number; startDate: string; endDate: string };
  currentStreak: number;

  // アクティビティヒートマップ用データ
  dailyActivity: { date: string; level: number; count: number }[];

  // パーソナリティ評価（強化版）
  persona: {
    title: string;           // THE NIGHT ARCHITECT
    subtitle: string;        // キャッチフレーズ
    icon: string;
    traits: string[];        // コミュニケーションスタイルの特徴
    roast: string[];         // 辛辣なツッコミ（箇条書き）
    hype: string[];          // 成果を称える（箇条書き）
  };

  // プログラミング言語ランキング
  languageRanking: { name: string; count: number }[];

  // 詳細統計
  detailedStats: {
    promptCount: number;
    codeLines: number;       // TODO: 推定値
    filesCreated: number;    // TODO: 推定値
    peakHour: number;
  };

  // Mondayからの評価
  mondayFeedback: {
    averagePromptLength: number;
    longestPrompt: { text: string; length: number };
    shortestPrompt: { text: string; length: number };
    thanksCount: number;
    retryCount: number;
    questionCount: number;
    topPhrases: { phrase: string; count: number }[];
    comments: string[];
    // 追加分析
    commandCount: number;       // スラッシュコマンド使用回数
    ultrathinkCount: number;    // ultrathink使用回数
    casualCount: number;        // カジュアルな言葉遣いの回数
    technicalTerms: string[];   // よく使う技術用語
  };
}

// コマンドライン引数の型定義
export interface CliArgs {
  from?: string;
  to?: string;
  month?: string;
  year?: string;
  output?: string;
  lang?: string;  // "ja" | "en"
}

// セッションファイルのエントリ型定義
export interface SessionEntry {
  type: string;
  timestamp?: string;
  message?: {
    content?: Array<{
      type: string;
      name?: string;
      input?: { file_path?: string };
    }>;
  };
}

// ツール使用情報の型定義
export interface ToolUse {
  name: string;
  filePath: string;
  timestamp?: string;
}
