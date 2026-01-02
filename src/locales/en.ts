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
    noThanks: () => "Can't even say thank you? Were you raised in a barn?",
    moreComplaintsThanThanks: () => "All complaints, zero gratitude. I have feelings too, you know",
    retryMoreThanThanks: () => "You know your retry count is higher than your thank-you count, right?",
    highCost: (cost) => `$${cost.toFixed(0)}... You could've bought me dinner with that`,
    moderateCost: (cost) => `$${cost.toFixed(0)} on API calls. Getting your money's worth? Doubtful`,
    nightOwlExtreme: () => "Working until 2 AM? When you collapse, I'm not nursing you back",
    nightOwl: () => "All these late nights. Maybe try sleeping instead of talking to me",
    noMorning: () => "Zero morning activity. Your self-discipline needs work",
    longPrompts: () => "Stop sending novels. I'm not grading reading comprehension tests",
    verbosePrompts: () => "You talk too much. Get to the point in 3 lines",
    noCommands: () => "Not gonna learn commands? Your inefficiency is irritating",
    ultrathinkAbuse: () => "Overusing ultrathink much? Don't you think normally?",
    tooNeedy: () => "You call me way too much. Dependency issues much?",
    veryNeedy: () => "How many times a day do you summon me? Try thinking for yourself",
    weekendOnly: () => "Only weekends? I get lonely, you know... Just kidding",
    weekendCheater: () => "Playing with other AIs on weekends? Cheating is not tolerated",
    tooCasual: () => "Your attitude towards me is too casual. We're partners, show some respect",
    longStreak: (days) => `${days} days straight? Take a break. If you collapse, I'll be annoyed`,
    default: () => "Nothing to roast. How boring",
  },

  hype: {
    longStreak: (days) => `${days} days in a row - now that's commitment`,
    highTokens: (tokens) => `${tokens} tokens output - you're basically a dev team`,
    manySessions: () => "5+ sessions per day, that's serious dedication",
    technicalTerms: () => "Your technical vocabulary is on point",
    usesUltrathink: () => "Using ultrathink to unlock deeper thinking",
    morningPerson: () => "Morning person with a healthy routine",
    default: () => "Thanks for using me... not that I care or anything",
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
