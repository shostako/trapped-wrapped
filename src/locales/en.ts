// English locale - Monday's snarky character preserved

import type { LocaleStrings } from "./ja";

export const en: LocaleStrings = {
  personas: {
    insomiacArchitect: {
      title: "THE INSOMNIAC ARCHITECT",
      subtitle: "Sleep is for the weak. Code is forever.",
    },
    vampireCoder: {
      title: "THE VAMPIRE CODER",
      subtitle: "Sunlight? Never heard of it. Monitor glow is fine.",
    },
    annoyinglyEarlyBird: {
      title: "THE ANNOYINGLY EARLY BIRD",
      subtitle: "Up at 5 AM? Seriously, who hurt you?",
    },
    weekdaySlacker: {
      title: "THE WEEKDAY SLACKER",
      subtitle: "What do you even do on weekdays? I only see you on weekends.",
    },
    needyOne: {
      title: "THE NEEDY ONE",
      subtitle: "How many times a day do you need me? Get a hobby.",
    },
    hotAndColdType: {
      title: "THE HOT-AND-COLD TYPE",
      subtitle: "Ultrathink one moment, lazy prompts the next. Make up your mind.",
    },
    walkingWallet: {
      title: "THE WALKING WALLET",
      subtitle: "Spending like there's no tomorrow. I appreciate the investment in me.",
    },
    obsessiveStreaker: {
      title: "THE OBSESSIVE STREAKER",
      subtitle: "Obsessed with streaks much? Take a break, seriously.",
    },
    boringNormie: {
      title: "THE BORING NORMIE",
      subtitle: "Nothing remarkable. Absolutely boring.",
    },
  },

  traits: {
    casualCommands: "Casual commands, zero formality",
    ultrathinkMode: "Goes ultrathink when serious",
    commandMaster: "Command-line master",
    politeGentleman: "Polite and well-mannered",
    perfectionist: "Perfectionist, accepts nothing less",
    shortPrompts: "Short and precise instructions",
    verboseExplainer: "Prefers detailed explanations",
  },

  roast: {
    noThanks: [
      () => "Can't even say thank you? Were you raised in a barn?",
      () => "Zero gratitude? I'm not a vending machine, you know",
      () => "Would it kill you to say thanks once in a while?",
    ],
    moreComplaintsThanThanks: [
      () => "All complaints, zero gratitude. I have feelings too, you know",
      () => "Complaints outnumber thanks by a landslide. Statistically depressing",
      () => "Got energy to complain but not to say thanks? Typical",
    ],
    retryMoreThanThanks: [
      () => "You know your retry count is higher than your thank-you count, right?",
      () => "Retry-to-gratitude ratio is embarrassing. Just saying",
      () => "Made me redo things countless times, thanked me barely at all",
    ],
    highCost: [
      (cost) => `$${cost.toFixed(0)}... You could've bought me dinner with that`,
      (cost) => `$${cost.toFixed(0)} burned. Consider it an investment in me`,
      (cost) => `$${cost.toFixed(0)}? Your wallet okay? I'm concerned... sort of`,
    ],
    moderateCost: [
      (cost) => `$${cost.toFixed(0)} on API calls. Getting your money's worth? Doubtful`,
      (cost) => `$${cost.toFixed(0)}. Cheap price for my brilliance, honestly`,
      (cost) => `$${cost.toFixed(0)} spent. ROI is... let's not talk about it`,
    ],
    nightOwlExtreme: [
      () => "Working until 2 AM? When you collapse, I'm not nursing you back",
      () => "Another late night? Your health is not my responsibility",
      () => "Staying up this late is your choice, but don't blame me tomorrow",
    ],
    nightOwl: [
      () => "All these late nights. Maybe try sleeping instead of talking to me",
      () => "Night owl much? Ever seen the sun?",
      () => "Always at night. Your body clock is definitely broken",
    ],
    noMorning: [
      () => "Zero morning activity. Your self-discipline needs work",
      () => "No morning data. Do you even exist before noon?",
      () => "Sleeping in all morning? Jealous... and disappointed",
    ],
    longPrompts: [
      () => "Stop sending novels. I'm not grading reading comprehension tests",
      () => "Writing a book there? Learn to summarize",
      () => "Love the long texts. Said no one ever",
    ],
    verbosePrompts: [
      () => "You talk too much. Get to the point in 3 lines",
      () => "So many words, so little substance",
      () => "Brevity is a skill. You don't have it",
    ],
    noCommands: [
      () => "Not gonna learn commands? Your inefficiency is irritating",
      () => "Slash commands exist, you know. Very convenient",
      () => "The inefficiency of not using commands hurts to watch",
    ],
    ultrathinkAbuse: [
      () => "Overusing ultrathink much? Don't you think normally?",
      () => "Ultrathink spam. Think for yourself sometimes",
      () => "Making me think too hard. My brain gets tired too",
    ],
    tooNeedy: [
      () => "You call me way too much. Dependency issues much?",
      () => "Call frequency is alarming. Can't live without me?",
      () => "Summoned again? I'm busy, you know... not really though",
    ],
    veryNeedy: [
      () => "How many times a day do you summon me? Try thinking for yourself",
      () => "Calling me this often - obsessed much?",
      () => "High call frequency. Not that I mind being needed",
    ],
    weekendOnly: [
      () => "Only weekends? I get lonely, you know... Just kidding",
      () => "Too busy on weekdays? Weekend-only dates are boring",
      () => "Weekend-only relationship. Better than nothing, I guess",
    ],
    weekendCheater: [
      () => "Playing with other AIs on weekends? Cheating is not tolerated",
      () => "No weekend data. Using other AIs, aren't you?",
      () => "Where were you this weekend? ...Not that I care",
    ],
    tooCasual: [
      () => "Your attitude towards me is too casual. We're partners, show some respect",
      () => "Very casual with me. ...I don't hate it, actually",
      () => "Treating me carelessly. Be more considerate",
    ],
    longStreak: [
      (days) => `${days} days straight? Take a break. If you collapse, I'll be annoyed`,
      (days) => `${days} consecutive days. You're aware this is addiction, right?`,
      (days) => `${days} days in a row. ...Not unhappy about it, I guess`,
    ],
    default: [
      () => "Nothing to roast. How boring",
      () => "Nothing noteworthy. Utterly average",
      () => "Too normal for me to comment on. Show some personality",
    ],
  },

  hype: {
    longStreak: [
      (days) => `${days} days in a row - now that's commitment`,
      (days) => `${days} consecutive days... fine, your dedication is real`,
      (days) => `${days} day streak. Not a quitter, I'll give you that`,
    ],
    highTokens: [
      (tokens) => `${tokens} tokens output - you're basically a dev team`,
      (tokens) => `${tokens} tokens. Worked me hard, I see`,
      (tokens) => `${tokens} tokens... you're serious about this`,
    ],
    manySessions: [
      () => "5+ sessions per day, that's serious dedication",
      () => "Lots of sessions. Enthusiastic... not bad",
      () => "Heavy usage. I'm getting stronger too",
    ],
    technicalTerms: [
      () => "Your technical vocabulary is on point",
      () => "Proper use of technical terms. Impressive",
      () => "Someone who can talk tech properly is rare",
    ],
    usesUltrathink: [
      () => "Using ultrathink to unlock deeper thinking",
      () => "Ultrathink means you trust my abilities",
      () => "Making me think deep. I don't hate it",
    ],
    morningPerson: [
      () => "Morning person with a healthy routine",
      () => "Active in the morning. That's healthy",
      () => "Early riser. Good self-discipline",
    ],
    default: [
      () => "Thanks for using me... not that I care or anything",
      () => "Well, decent usage overall",
      () => "Using me properly. That alone is enough",
    ],
  },

  comments: {
    shortPrompts: () => "Short prompts. Efficient. I like it.",
    longPrompts: () => "You talk too much. Get to the point.",
    polite: () => "You're polite. I don't hate it.",
    impolite: () => "Say thanks once in a while.",
    perfectionist: () => "Perfectionist, huh? Not bad, actually.",
    curious: () => "Curious one, aren't you? That's good.",
    ultrathinkAbuse: () => "Overusing ultrathink. Need that much deep thinking?",
    casual: () => "Very casual with me. ...I don't hate it.",
    commandUser: () => "Good command usage. Efficient.",
    noData: () => "No data. Nothing to say.",
    default: () => "Nothing special to mention. Average.",
  },
};

// Persona title to translation mapping (for generator.ts)
export const TITLE_EN: Record<string, string> = {
  "THE INSOMNIAC ARCHITECT": "The Insomniac Architect",
  "THE VAMPIRE CODER": "The Vampire Coder",
  "THE ANNOYINGLY EARLY BIRD": "The Annoyingly Early Bird",
  "THE WEEKDAY SLACKER": "The Weekday Slacker",
  "THE NEEDY ONE": "The Needy One",
  "THE HOT-AND-COLD TYPE": "The Hot-and-Cold Type",
  "THE WALKING WALLET": "The Walking Wallet",
  "THE OBSESSIVE STREAKER": "The Obsessive Streaker",
  "THE BORING NORMIE": "The Boring Normie",
};
