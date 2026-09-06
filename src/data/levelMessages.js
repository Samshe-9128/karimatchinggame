import { getVersion, MAX_LEVEL } from "../utils/gameConfig";
import  KARI_MESSAGES from "../data/kariMessages";
// ============================================================
// 1. ORIGINAL 100 MESSAGES (unchanged)
// ============================================================


// ============================================================
// 2. MILESTONE MESSAGES (overrides at specific levels)
// ============================================================
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

// ============================================================
// 3. VERSION NAMES (used in generated messages)
// ============================================================
const VERSION_NAMES = {
  2: "Secret Garden",
  3: "Shuffle Road",
  4: "Chaos Carnival",
  5: "Time Rift",
  6: "Mirror Maze",
  7: "Phantom Woods",
  8: "Storm Highway",
  9: "Nightmare District",
  10: "Boss Road",
  11: "Final Dream",
};

// ============================================================
// 4. TEMPLATE POOLS BY CATEGORY
//    Each template may contain {level}, {version}, or {adj}
//    placeholders that get filled at runtime.
// ============================================================

// --- SWEET / APPRECIATIVE ---
const SWEET_TEMPLATES = [
  "You're doing amazing, Kari. I see how hard you're trying 🌸",
  "Another level down. I'm still cheering for you, always.",
  "You make this look easy. I know it isn't.",
  "I'm proud of you. Not just for the game, but for everything.",
  "You're my favorite person to watch succeed.",
  "The way you focus is actually really cute.",
  "I hope you know how much I believe in you.",
  "Every level you beat, I like you a little more. That's not a joke.",
  "You're stronger than you think. Even when the board is chaos.",
  "Thank you for playing this silly game. It means a lot.",
  "You're the best part of my day, Kari.",
  "No matter how many levels you pass, I'll always be here to annoy you. But also to support you.",
  "You're doing better than you give yourself credit for.",
  "I love watching you win. Keep going.",
  "Your smile could power this whole game. Just saying.",
];

// --- TEASING / PLAYFUL ---
const TEASING_TEMPLATES = [
  "You're getting too good at this. It's suspicious 👀",
  "Did you just beat that level? I'm not impressed... okay maybe a little.",
  "Careful, your ego is showing 😂",
  "Another win? I'm starting to think you're cheating with your cuteness.",
  "You're so stubborn, you'd probably beat this game out of spite.",
  "I made this level specifically to annoy you. It didn't work.",
  "You're not allowed to be this good AND this cute. Pick one.",
  "I swear you're just guessing and getting lucky.",
  "You know I can't stay mad when you win. It's annoying.",
  "If you keep winning, I'll have to make level 5000 literally impossible.",
  "You think you're so smart. You are, but still.",
  "I'm not saying I let you win... but I'm also not not saying that.",
  "Your victory dance is probably adorable. I can't see it, but I know.",
  "You beat that level way too fast. Were you even trying to enjoy my messages?",
  "You're making me regret adding hints. Not really, but still.",
];

// --- CUTE / FLIRTY ---
const CUTE_TEMPLATES = [
  "You're cute when you're focused. I've said it before, I'll say it again.",
  "Every level you pass, I fall for you a little more. It's a problem.",
  "I made this game just so I'd have an excuse to talk to you. It worked.",
  "You have no idea how much I enjoy watching you play.",
  "If I were there, I'd probably be too distracted by you to help with the level.",
  "Your little victory messages are the highlight of my day.",
  "I could watch you play this for hours. Actually, I already do.",
  "You're dangerously cute and dangerously good at this. Deadly combo.",
  "I think about you more than I think about this game. And I made it.",
  "You're my favorite notification.",
  "I hope you're smiling right now, because that's all I want.",
  "You're the reason I keep adding levels. I just want more excuses to message you.",
  "If you were an emoji, you'd be the one I can't find because I'm too busy looking at you.",
  "I'm not saying you're perfect, but you're pretty close.",
  "You make my heart do that weird thing. You know the one.",
];

// --- FUNNY / SILLY ---
const FUNNY_TEMPLATES = [
  "Did you know that 90% of players quit right before they win? You're the 10%.",
  "I'm legally required to tell you that you're doing great. Also illegally.",
  "I put a 'secret message' in every level. It's just me being annoying.",
  "You found the hidden emoji, and now you've found this hidden message. Surprise!",
  "I asked a genie for a brilliant player. I got you. Genie had good taste.",
  "This level was brought to you by my undying need to bother you.",
  "You're doing so well that I'm starting to question my own game's difficulty.",
  "If you beat level 5000, I'll give you a prize. The prize is more of my messages.",
  "I spent 10 minutes writing this message. Worth it.",
  "You're like a human cheat code. But cuter.",
  "I'm running out of ways to say 'you're good at this' without inflating your ego. Help.",
  "This level was sponsored by 'Sam being annoying'. No refunds.",
  "You've unlocked the secret achievement: 'Putting up with Sam'.",
  "I'd give you a gold star, but I'm all out. Here's a virtual cookie 🍪",
  "You're so good at this game that I'm starting to think you have a superpower. The superpower is being you.",
];

// --- SHORT & SWEET ---
const SHORT_TEMPLATES = [
  "Good job. Next.",
  "Boom. Done. You're welcome.",
  "Nice work, nerd 😌",
  "You did it. Shocking.",
  "Another one bites the dust.",
  "Easy peasy for you, huh?",
  "Don't get used to it.",
  "You're on a roll.",
  "Level up! ...Oh wait, that's you.",
  "Flawless. Almost suspicious.",
  "Keep going, I'm watching (in a supportive way).",
  "You're doing the thing!",
  "Nice. Now do it again.",
  "You make this look fun.",
  "I'd high‑five you if I could. ✋",
];

// --- LONG & REFLECTIVE ---
const LONG_TEMPLATES = [
  "You know, when I made this game, I never expected you to actually get this far. I should've known you'd be too stubborn to stop. I'm not complaining, though. I like having you here.",
  "Every level you pass is like a little reminder that you can do anything you set your mind to. Even when the board is messy and the cards keep moving, you find a way. It's honestly inspiring, Kari.",
  "I've written so many messages for you that I've lost count. But each one is a tiny note from me to you, saying 'I'm still here, and I'm still proud of you.'",
  "Some days are hard, I know. But you're still here, still playing, still winning. That says more about you than any game score ever could.",
  "You've been through a lot of levels by now. Each one a little challenge, a little test. And you've passed every single one. You're not just good at this game—you're good at life, too.",
  "I think part of the reason I made this game was to prove to myself that I could make something you'd enjoy. Seeing you play it, seeing you succeed... that's better than I imagined.",
  "There's a kind of magic in watching you focus. It's like the whole world disappears except you and the board. I could watch that forever.",
  "You don't have to be perfect, Kari. You just have to keep going. And that's exactly what you're doing. I admire that.",
  "I hope you're taking care of yourself between levels. You deserve rest, too. But I'm also happy you're here.",
  "This is one of those moments where I wish I could be there in person, just to see your face when you beat another level. Maybe one day.",
  "You've unlocked so many messages now. I hope they make you feel a little less alone, a little more appreciated. Because you are.",
  "The game would be nothing without you playing it. You bring it to life.",
];

// --- VERSION THEMED (extra variety per version) ---
// We'll add a few version‑specific templates that can be mixed in.
const VERSION_SPECIFIC = {
  2: [
    "Secret Garden is treating you well, I see. 🌷",
    "In the garden, even the flowers are impressed by you.",
  ],
  3: [
    "Shuffle Road is no match for your memory.",
    "The road may shift, but your focus doesn't.",
  ],
  4: [
    "Chaos Carnival is chaotic, but you're calmer than a carousel.",
    "Traps and bombs? You handle them like it's a walk in the park.",
  ],
  5: [
    "Time Rift is ticking, and you're still ahead of the clock.",
    "Every second counts, and you're using them perfectly.",
  ],
  6: [
    "Mirror Maze can't confuse someone as sharp as you.",
    "You're navigating the maze like you built it yourself.",
  ],
  7: [
    "Phantom Woods is spooky, but you're fearless.",
    "The ghosts are probably more scared of you than you are of them.",
  ],
  8: [
    "Storm Highway is rough, but you're riding it like a pro.",
    "Blackouts and storms? You've got this.",
  ],
  9: [
    "Nightmare District is dark, but you're the light.",
    "One mistake can cost everything, but you don't make mistakes.",
  ],
  10: [
    "Boss Road is where legends are made. You're a legend.",
    "Boss levels only make you stronger.",
  ],
  11: [
    "Final Dream: this is where it all ends. You're almost there.",
    "The final road is long, but you've come so far.",
  ],
};

// ============================================================
// 5. ADJECTIVE POOL (for dynamic placeholders)
// ============================================================
const ADJECTIVES = [
  "amazing", "brilliant", "stubborn", "cute", "ridiculous", "unstoppable",
  "focused", "sneaky", "adorable", "impressive", "chaotic", "determined",
  "fearless", "smooth", "silly", "perfect", "relentless", "charming",
  "clever", "dramatic", "elegant", "fierce", "gentle", "heroic",
  "incredible", "joyful", "kind", "legendary", "mysterious", "noble",
  "optimistic", "passionate", "quick", "radiant", "sharp", "thoughtful",
  "unique", "vibrant", "witty", "zealous"
];

// ============================================================
// 6. HELPER: deterministic pseudo‑random selection
//    (so messages feel varied but are always the same for a given level)
// ============================================================
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Pick a template from an array using level as seed, ensuring variety
function pickFromArray(arr, level) {
  const idx = Math.floor(seededRandom(level) * arr.length);
  return arr[idx];
}

// ============================================================
// 7. MAIN MESSAGE GENERATOR
// ============================================================
export function getLevelMessage(level) {
  // ----- Milestone override -----
  if (MILESTONES[level]) {
    return MILESTONES[level];
  }

  // ----- Original 100 messages -----
  if (level <= KARI_MESSAGES.length) {
    return KARI_MESSAGES[level - 1];
  }

  // ----- For levels 101–5000: generate a message -----
  const version = getVersion(level); // getVersion returns object with id, min, max
  const versionId = version.id;
  const versionName = VERSION_NAMES[versionId] || "Secret Garden";

  // Determine category based on level properties
  const mod10 = level % 10;
  const mod20 = level % 20;
  const mod25 = level % 25;

  let template;

  // Every 10th level: cute
  if (mod10 === 0) {
    template = pickFromArray(CUTE_TEMPLATES, level);
  }
  // Every 25th level: long reflective
  else if (mod25 === 0) {
    template = pickFromArray(LONG_TEMPLATES, level);
  }
  // Every 5th level: funny
  else if (level % 5 === 0) {
    template = pickFromArray(FUNNY_TEMPLATES, level);
  }
  // Every 7th level: short & sweet
  else if (level % 7 === 0) {
    template = pickFromArray(SHORT_TEMPLATES, level);
  }
  // Every 3rd level: teasing
  else if (level % 3 === 0) {
    template = pickFromArray(TEASING_TEMPLATES, level);
  }
  // Otherwise: sweet
  else {
    template = pickFromArray(SWEET_TEMPLATES, level);
  }

  // Occasionally (5% chance) use a version‑specific template instead
  if (seededRandom(level + 999) < 0.05 && VERSION_SPECIFIC[versionId]) {
    template = pickFromArray(VERSION_SPECIFIC[versionId], level);
  }

  // Replace placeholders
  const adj = pickFromArray(ADJECTIVES, level + 12345);
  let msg = template
    .replaceAll("{level}", level)
    .replaceAll("{version}", versionName)
    .replaceAll("{adj}", adj);

  // Add a tiny level-based suffix occasionally to make it even more unique
  if (level % 100 === 99) {
    msg += " (Also, you're almost at the next century of levels. 👀)";
  }

  return msg;
}

// Keep this export for backward compatibility if needed
export function getFinalMessage() {
  return MILESTONES[MAX_LEVEL];
}