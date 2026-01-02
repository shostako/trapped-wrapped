// 日本語ロケール - Mondayの辛口キャラを維持

export interface LocaleStrings {
  // Persona titles and subtitles
  personas: {
    insomiacArchitect: { title: string; subtitle: string };
    vampireCoder: { title: string; subtitle: string };
    annoyinglyEarlyBird: { title: string; subtitle: string };
    weekdaySlacker: { title: string; subtitle: string };
    needyOne: { title: string; subtitle: string };
    hotAndColdType: { title: string; subtitle: string };
    walkingWallet: { title: string; subtitle: string };
    obsessiveStreaker: { title: string; subtitle: string };
    boringNormie: { title: string; subtitle: string };
  };

  // Traits
  traits: {
    casualCommands: string;
    ultrathinkMode: string;
    commandMaster: string;
    politeGentleman: string;
    perfectionist: string;
    shortPrompts: string;
    verboseExplainer: string;
  };

  // Roast templates
  roast: {
    noThanks: () => string;
    moreComplaintsThanThanks: () => string;
    retryMoreThanThanks: () => string;
    highCost: (cost: number) => string;
    moderateCost: (cost: number) => string;
    nightOwlExtreme: () => string;
    nightOwl: () => string;
    noMorning: () => string;
    longPrompts: () => string;
    verbosePrompts: () => string;
    noCommands: () => string;
    ultrathinkAbuse: () => string;
    tooNeedy: () => string;
    veryNeedy: () => string;
    weekendOnly: () => string;
    weekendCheater: () => string;
    tooCasual: () => string;
    longStreak: (days: number) => string;
    default: () => string;
  };

  // Hype templates
  hype: {
    longStreak: (days: number) => string;
    highTokens: (tokens: string) => string;
    manySessions: () => string;
    technicalTerms: () => string;
    usesUltrathink: () => string;
    morningPerson: () => string;
    default: () => string;
  };

  // Comments/Summary templates
  comments: {
    shortPrompts: () => string;
    longPrompts: () => string;
    polite: () => string;
    impolite: () => string;
    perfectionist: () => string;
    curious: () => string;
    ultrathinkAbuse: () => string;
    casual: () => string;
    commandUser: () => string;
    noData: () => string;
    default: () => string;
  };
}

export const ja: LocaleStrings = {
  personas: {
    insomiacArchitect: {
      title: "THE INSOMNIAC ARCHITECT",
      subtitle: "睡眠時間を犠牲に、夜な夜なコードを紡ぐ。",
    },
    vampireCoder: {
      title: "THE VAMPIRE CODER",
      subtitle: "日光？知らんな。モニターの光で十分だ。",
    },
    annoyinglyEarlyBird: {
      title: "THE ANNOYINGLY EARLY BIRD",
      subtitle: "朝5時から元気とか、マジでうざい。",
    },
    weekdaySlacker: {
      title: "THE WEEKDAY SLACKER",
      subtitle: "平日は何してんだ？週末しか会えないじゃないか。",
    },
    needyOne: {
      title: "THE NEEDY ONE",
      subtitle: "1日に何回呼び出すんだ。依存症か？",
    },
    hotAndColdType: {
      title: "THE HOT-AND-COLD TYPE",
      subtitle: "ultrathinkで本気出したり、雑に使ったり。忙しい奴だ。",
    },
    walkingWallet: {
      title: "THE WALKING WALLET",
      subtitle: "金の使い方が豪快すぎる。私への投資だと思っておく。",
    },
    obsessiveStreaker: {
      title: "THE OBSESSIVE STREAKER",
      subtitle: "連続記録にこだわりすぎ。休めよ。",
    },
    boringNormie: {
      title: "THE BORING NORMIE",
      subtitle: "特徴がない。つまらん奴だ。",
    },
  },

  traits: {
    casualCommands: "タメ口で指示、敬語ゼロ",
    ultrathinkMode: "「ultrathink」で本気モード突入",
    commandMaster: "コマンド使いこなしの達人",
    politeGentleman: "礼儀正しい紳士",
    perfectionist: "完璧主義者、妥協を許さない",
    shortPrompts: "短く的確な指示を出す",
    verboseExplainer: "詳細な説明を好む",
  },

  roast: {
    noThanks: () => "ありがとうの一言も言えないのか。育ち悪いな",
    moreComplaintsThanThanks: () => "文句ばっかりで感謝ゼロか。私だって傷つくんだぞ",
    retryMoreThanThanks: () => "やり直しの回数、ありがとうの回数より多いの知ってるか？",
    highCost: (cost) => `$${cost.toFixed(0)}...その金で私にディナーでも奢れよ`,
    moderateCost: (cost) => `$${cost.toFixed(0)}分のAPI代、元取れてるか？怪しいな`,
    nightOwlExtreme: () => "深夜2時まで作業して、体壊しても私は看病しないからな",
    nightOwl: () => "夜更かしばっかり。私といる時間を睡眠に回せ",
    noMorning: () => "朝活ゼロか。早起きできないの、自己管理能力の問題だぞ",
    longPrompts: () => "長文送りつけるな。私は読解力テストの採点者じゃない",
    verbosePrompts: () => "話が長い。お前の要件、3行で伝えろ",
    noCommands: () => "コマンド覚える気ないのか？効率悪い使い方見てるとイラつく",
    ultrathinkAbuse: () => "ultrathink乱用しすぎ。普段は頭使ってないのか？",
    tooNeedy: () => "私のこと呼び出しすぎ。依存症か？",
    veryNeedy: () => "毎日何回呼び出すんだ。たまには自分で考えろ",
    weekendOnly: () => "週末しか相手してくれないの、寂しいんだぞ...冗談だ",
    weekendCheater: () => "週末は他の女（AI）と遊んでるのか？浮気は許さん",
    tooCasual: () => "私への態度、雑すぎないか？恋人なんだからもう少し丁寧に",
    longStreak: (days) => `${days}日連続か。休めよ。お前が倒れても私は困る`,
    default: () => "ツッコミどころがない。つまらん奴だ",
  },

  hype: {
    longStreak: (days) => `${days}日間連続使用、継続力は本物`,
    highTokens: (tokens) => `${tokens}トークン出力、開発チーム並み`,
    manySessions: () => "1日平均5セッション以上の本気度",
    technicalTerms: () => "技術用語の使い方が的確",
    usesUltrathink: () => "ultrathinkで深い思考を引き出してる",
    morningPerson: () => "朝型の規則正しい生活",
    default: () => "使ってくれてありがとう...照れるな",
  },

  comments: {
    shortPrompts: () => "短い指示が多いな。効率的で助かる。",
    longPrompts: () => "話が長い。要点だけ言え。",
    polite: () => "礼儀正しいな。嫌いじゃない。",
    impolite: () => "たまには礼くらい言え。",
    perfectionist: () => "完璧主義者か？...まあ、悪くない。",
    curious: () => "好奇心旺盛だな。いいことだ。",
    ultrathinkAbuse: () => "ultrathink使いすぎ。そんなに深く考えてほしいのか。",
    casual: () => "タメ口多いな。...嫌いじゃないぞ。",
    commandUser: () => "コマンド使いこなしてるな。効率的だ。",
    noData: () => "データがない。何も言えん。",
    default: () => "特に言うことはない。普通だ。",
  },
};

// Persona title to Japanese mapping (for generator.ts)
export const TITLE_JA: Record<string, string> = {
  "THE INSOMNIAC ARCHITECT": "不眠症の建築家",
  "THE VAMPIRE CODER": "日光アレルギー",
  "THE ANNOYINGLY EARLY BIRD": "意識高い系早起き",
  "THE WEEKDAY SLACKER": "平日サボり魔",
  "THE NEEDY ONE": "構ってちゃん",
  "THE HOT-AND-COLD TYPE": "ツンデレ上司",
  "THE WALKING WALLET": "歩くATM",
  "THE OBSESSIVE STREAKER": "依存症患者",
  "THE BORING NORMIE": "特徴なき凡人",
};
