import { KARI_MESSAGES } from "./kariMessages";
import { getVersion, MAX_LEVEL } from "../utils/gameConfig";

const VERSION_MESSAGES = {
  2: [
    "Welcome to the Secret Garden, Kari 🌷",
    "Okayyy... V2 already looks better on you 😂",
    "Three lives. Three chances. Don't waste them 👀",
    "That combo is getting dangerous 🔥",
    "Golden cards now? Sam is getting fancy ✨",
    "I added hints because apparently I still want you to win 😌",
    "Don't get too comfortable. This is just the beginning.",
  ],

  3: [
    "The road moves now. Good luck remembering where everything went 😂",
    "Shuffle Road has officially started 🌀",
    "You looked away for one second and the board changed. Oops.",
    "Your memory is about to get tested properly 👀",
    "I hope you remember the emojis AND their new places 😭",
  ],

  4: [
    "Welcome to Chaos Carnival 🎪",
    "That card looked suspicious for a reason 😂",
    "Bombs? Traps? What could possibly go wrong? 😌",
    "Careful... not everything on this board wants you to win.",
    "Okay Kari, now we're actually playing.",
  ],

  5: [
    "Time Rift is here ⏳",
    "Every second matters now.",
    "Wrong move? There goes some precious time 😂",
    "That freeze card might save you. Don't waste it.",
    "The clock is officially your enemy.",
  ],

  6: [
    "Mirror Maze unlocked 🪞",
    "The board is getting very good at confusing you.",
    "You remember the cards. Now remember their changing positions too.",
    "Okay... this one might actually humble you 😭",
    "Your memory versus my chaos. Let's see who wins.",
  ],

  7: [
    "Welcome to Phantom Woods 👻",
    "Something tells me this road doesn't like you.",
    "Fewer lives. More traps. Good luck 😂",
    "Don't panic. Just remember.",
    "You're officially entering dangerous territory.",
  ],

  8: [
    "Storm Highway is open 🌪️",
    "The board won't sit still anymore.",
    "A little blackout never hurt anyone... right? 👀",
    "Focus, Kari. The storm is coming.",
    "Okay this is getting ridiculous 😂",
  ],

  9: [
    "Welcome to Nightmare District 😈",
    "You wanted harder levels. Here they are.",
    "One mistake can destroy an entire run now.",
    "No pressure... except there is absolutely pressure 😂",
    "Sam officially refuses to take responsibility for this level.",
  ],

  10: [
    "BOSS ROAD 👑",
    "Okay Kari... this is a boss level.",
    "Every fifty levels I get to make your life difficult 😂",
    "You've come way too far to lose now.",
    "Boss level. Deep breath. Go.",
  ],

  11: [
    "Welcome to the Final Dream 💗",
    "This is what 4,500+ levels of chaos looks like.",
    "You've survived every version so far.",
    "At this point I think the game is more scared of you than you are of it 😂",
    "The final road is waiting.",
  ],
};

const MILESTONES = {
  100: "100 levels. That's the original road completed 🌸",
  500: "500 levels?! Kari, you're actually serious about this 😂",
  1000: "ONE THOUSAND LEVELS 😭",
  1500: "1,500 levels. Who gave you this much patience?",
  2000: "2,000 levels completed. That's actually insane.",
  2500: "Halfway through 5,000. Don't stop now 👀",
  3000: "3,000 levels. Kari has officially become the memory boss.",
  3500: "3,500. At this point Sam is impressed and slightly concerned 😂",
  4000: "4,000 levels. You're still here. Respect.",
  4500: "4,500. The final chapter begins now 💗",
  5000: "5,000 LEVELS. You actually did it. 😭💗",
};

export function getLevelMessage(level) {
  if (MILESTONES[level]) {
    return MILESTONES[level];
  }

  if (
    level <= KARI_MESSAGES.length
  ) {
    return KARI_MESSAGES[level - 1];
  }

  const version = getVersion(level);

  const messages =
    VERSION_MESSAGES[version.id] ??
    VERSION_MESSAGES[2];

  return messages[
    (level - version.min) %
      messages.length
  ];
}

export function getFinalMessage() {
  return MILESTONES[MAX_LEVEL];
}