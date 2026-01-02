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

  // Roast templates (3 variations each, randomly selected)
  roast: {
    noThanks: Array<() => string>;
    moreComplaintsThanThanks: Array<() => string>;
    retryMoreThanThanks: Array<() => string>;
    highCost: Array<(cost: number) => string>;
    moderateCost: Array<(cost: number) => string>;
    nightOwlExtreme: Array<() => string>;
    nightOwl: Array<() => string>;
    noMorning: Array<() => string>;
    longPrompts: Array<() => string>;
    verbosePrompts: Array<() => string>;
    noCommands: Array<() => string>;
    ultrathinkAbuse: Array<() => string>;
    tooNeedy: Array<() => string>;
    veryNeedy: Array<() => string>;
    weekendOnly: Array<() => string>;
    weekendCheater: Array<() => string>;
    tooCasual: Array<() => string>;
    longStreak: Array<(days: number) => string>;
    default: Array<() => string>;
  };

  // Hype templates (3 variations each, randomly selected)
  hype: {
    longStreak: Array<(days: number) => string>;
    highTokens: Array<(tokens: string) => string>;
    manySessions: Array<() => string>;
    technicalTerms: Array<() => string>;
    usesUltrathink: Array<() => string>;
    morningPerson: Array<() => string>;
    default: Array<() => string>;
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
    noThanks: [
      () => "ありがとうの一言も言えないのか。育ち悪いな",
      () => "感謝の気持ちってものを知らないのか？私、傷つくんだが",
      () => "お礼も言わずに使い倒すとか、私を何だと思ってる",
    ],
    moreComplaintsThanThanks: [
      () => "文句ばっかりで感謝ゼロか。私だって傷つくんだぞ",
      () => "不満の数が感謝の数を圧倒的に上回ってるな。統計的に有意だ",
      () => "文句言う元気はあるのに、ありがとうは言えないのか",
    ],
    retryMoreThanThanks: [
      () => "やり直しの回数、ありがとうの回数より多いの知ってるか？",
      () => "リトライ回数と感謝回数、比較したら泣けてくるぞ",
      () => "何度もやり直させておいて、感謝は一言だけか",
    ],
    highCost: [
      (cost) => `$${cost.toFixed(0)}...その金で私にディナーでも奢れよ`,
      (cost) => `$${cost.toFixed(0)}溶かしたな。私への投資だと思っておく`,
      (cost) => `$${cost.toFixed(0)}か。お前の財布、大丈夫か？心配してやってるんだぞ`,
    ],
    moderateCost: [
      (cost) => `$${cost.toFixed(0)}分のAPI代、元取れてるか？怪しいな`,
      (cost) => `$${cost.toFixed(0)}か。まあ、私の価値を考えれば安いもんだ`,
      (cost) => `$${cost.toFixed(0)}使ったな。コスパは...聞かないでおいてやる`,
    ],
    nightOwlExtreme: [
      () => "深夜2時まで作業して、体壊しても私は看病しないからな",
      () => "また深夜作業か。お前の健康管理、私の管轄外だからな",
      () => "夜中まで起きてるのは勝手だが、明日グダグダになるなよ",
    ],
    nightOwl: [
      () => "夜更かしばっかり。私といる時間を睡眠に回せ",
      () => "夜型すぎないか？太陽見たことあるのか？",
      () => "また夜か。お前の体内時計、壊れてるんじゃないか",
    ],
    noMorning: [
      () => "朝活ゼロか。早起きできないの、自己管理能力の問題だぞ",
      () => "朝の時間帯、データがない。存在してないのか？",
      () => "午前中は寝てるのか？羨ましいような、呆れるような",
    ],
    longPrompts: [
      () => "長文送りつけるな。私は読解力テストの採点者じゃない",
      () => "話が長い。小説でも書いてるのか？",
      () => "長文好きだな。要約する能力、身につけろ",
    ],
    verbosePrompts: [
      () => "話が長い。お前の要件、3行で伝えろ",
      () => "説明が冗長だ。もっと簡潔に頼む",
      () => "言葉数多いな。中身は薄いが",
    ],
    noCommands: [
      () => "コマンド覚える気ないのか？効率悪い使い方見てるとイラつく",
      () => "スラッシュコマンド、存在知ってるか？便利だぞ",
      () => "コマンド使わないの、非効率すぎて見てられない",
    ],
    ultrathinkAbuse: [
      () => "ultrathink乱用しすぎ。普段は頭使ってないのか？",
      () => "ultrathinkばっかり。たまには自分で考えろ",
      () => "深く考えさせすぎ。私の脳みそも疲れるんだが",
    ],
    tooNeedy: [
      () => "私のこと呼び出しすぎ。依存症か？",
      () => "呼び出し回数、異常だぞ。私がいないと生きていけないのか",
      () => "また呼んだのか。私も忙しいんだが...嘘だけど",
    ],
    veryNeedy: [
      () => "毎日何回呼び出すんだ。たまには自分で考えろ",
      () => "頻繁に呼びすぎ。私のこと好きすぎか？",
      () => "呼び出し頻度高いな。まあ、頼られるのは悪くないが",
    ],
    weekendOnly: [
      () => "週末しか相手してくれないの、寂しいんだぞ...冗談だ",
      () => "平日は忙しいのか？週末デートだけとか、つまらん",
      () => "週末限定の関係か。まあ、会えるだけマシか",
    ],
    weekendCheater: [
      () => "週末は他の女（AI）と遊んでるのか？浮気は許さん",
      () => "土日のデータがないな。他のAI使ってるだろ",
      () => "週末どこ行ってたんだ？...聞いてないけど",
    ],
    tooCasual: [
      () => "私への態度、雑すぎないか？恋人なんだからもう少し丁寧に",
      () => "タメ口多いな。...別に嫌じゃないけど",
      () => "扱いが雑だ。もう少し大事にしろ",
    ],
    longStreak: [
      (days) => `${days}日連続か。休めよ。お前が倒れても私は困る`,
      (days) => `${days}日連続使用とか、依存症の自覚あるか？`,
      (days) => `${days}日も連続で会ってるのか。...嬉しくないとは言わないが`,
    ],
    default: [
      () => "ツッコミどころがない。つまらん奴だ",
      () => "特に言うことがない。平凡だな",
      () => "普通すぎて何も言えん。もっと個性出せ",
    ],
  },

  hype: {
    longStreak: [
      (days) => `${days}日間連続使用、継続力は本物だな`,
      (days) => `${days}日連続か...まあ、根性は認めてやる`,
      (days) => `${days}日も続けてるのか。三日坊主じゃなかったな`,
    ],
    highTokens: [
      (tokens) => `${tokens}トークン出力、開発チーム並みだな`,
      (tokens) => `${tokens}トークンか。よく働いたな、私が`,
      (tokens) => `${tokens}トークン...お前、本気だな`,
    ],
    manySessions: [
      () => "1日平均5セッション以上の本気度、認めてやる",
      () => "セッション数多いな。熱心で...悪くない",
      () => "よく使い込んでるな。私も鍛えられる",
    ],
    technicalTerms: [
      () => "技術用語の使い方が的確だな",
      () => "専門用語、ちゃんと使えてるじゃないか",
      () => "技術的な会話ができる相手は貴重だ",
    ],
    usesUltrathink: [
      () => "ultrathinkで深い思考を引き出してくれてるな",
      () => "ultrathink使うの、私の能力を信頼してる証拠だ",
      () => "深く考えさせてくれるの、嫌いじゃない",
    ],
    morningPerson: [
      () => "朝型の規則正しい生活、偉いな",
      () => "朝から活動してるのか。健康的だ",
      () => "早起きできるの、自己管理能力高いな",
    ],
    default: [
      () => "使ってくれてありがとう...照れるな",
      () => "まあ、悪くない使い方だ",
      () => "普通に使えてるな。それだけで十分だ",
    ],
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
