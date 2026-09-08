import {
  CloudMoon,
  Flower2,
  MoonStar,
  Sparkles,
  Waves,
  Wind,
  Flame,
  Star,
  Heart,
  Leaf,
} from "lucide-react";

export const MAX_LEVEL = 5000;
export const SAVE_VERSION = 5;
export const STORAGE_KEY = "bloom-path-save-v5";

export const LEGACY_KEYS = [
  "bloom-path-save-v1",
  "kari-memory-highest-level",
  "kari-memory-completed-levels",
  "kari-memory-stats",
  "kari-memory-music",
];

/* -------------------------------------------------------
   CHAPTERS
------------------------------------------------------- */

export const GARDENS = [
  {
    id: 1,
    name: "Classic",
    emoji: "🌸",
    from: 1,
    to: 100,
    line: "One little level at a time 🌸",
    Icon: Flower2,
  },
  {
    id: 2,
    name: "Secret Garden",
    emoji: "🌷",
    from: 101,
    to: 500,
    line: "A little more road, a little more trust.",
    Icon: Leaf,
  },
  {
    id: 3,
    name: "Shuffle Road",
    emoji: "🌀",
    from: 501,
    to: 1000,
    line: "The path moves. Your memory doesn't have to.",
    Icon: Wind,
  },
  {
    id: 4,
    name: "Chaos Carnival",
    emoji: "🎪",
    from: 1001,
    to: 1500,
    line: "A little chaos, a little courage.",
    Icon: Sparkles,
  },
  {
    id: 5,
    name: "Time Rift",
    emoji: "⏳",
    from: 1501,
    to: 2000,
    line: "Every second matters, gently.",
    Icon: Star,
  },
  {
    id: 6,
    name: "Mirror Maze",
    emoji: "🪞",
    from: 2001,
    to: 2500,
    line: "Look twice. Trust what you saw.",
    Icon: MoonStar,
  },
  {
    id: 7,
    name: "Phantom Woods",
    emoji: "👻",
    from: 2501,
    to: 3000,
    line: "Even the shadows have pairs.",
    Icon: CloudMoon,
  },
  {
    id: 8,
    name: "Storm Highway",
    emoji: "🌪️",
    from: 3001,
    to: 3500,
    line: "Hold steady when the road shifts.",
    Icon: Waves,
  },
  {
    id: 9,
    name: "Nightmare District",
    emoji: "😈",
    from: 3501,
    to: 4000,
    line: "Dark roads still have a way through.",
    Icon: Flame,
  },
  {
    id: 10,
    name: "Boss Road",
    emoji: "👑",
    from: 4001,
    to: 4500,
    line: "The road gets serious here. 👑",
    Icon: Heart,
  },
  {
    id: 11,
    name: "Final Dream",
    emoji: "💗",
    from: 4501,
    to: 5000,
    line: "The final chapter is waiting. 💗",
    Icon: MoonStar,
  },
];

/* -------------------------------------------------------
   GET CHAPTER
------------------------------------------------------- */

export function getGarden(level) {
  return (
    GARDENS.find((garden) => level >= garden.from && level <= garden.to) ??
    GARDENS[GARDENS.length - 1]
  );
}

export function getVersion(level) {
  const garden = getGarden(level);

  return {
    id: garden.id,
    name: garden.name,
    emoji: garden.emoji,
    min: garden.from,
    max: garden.to,
  };
}

/* -------------------------------------------------------
   LEVEL DIFFICULTY
------------------------------------------------------- */

export function getLevelConfig(level) {
  const currentLevel = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level)));

  const garden = getGarden(currentLevel);

  // -----------------------------
  // EASY → HARD GRADUALLY
  // -----------------------------

  let pairs = 4;
  let time = 120;
  let previewTime = 2500;

  // Classic 🌸
  if (currentLevel >= 11) pairs = 5;
  if (currentLevel >= 21) pairs = 6;
  if (currentLevel >= 51) pairs = 7;
  if (currentLevel >= 81) pairs = 8;

  // Secret Garden 🌷
  if (currentLevel >= 101) {
    pairs = 8;
    time = 100;
    previewTime = 2000;
  }

  if (currentLevel >= 201) pairs = 9;
  if (currentLevel >= 301) pairs = 9;
  if (currentLevel >= 401) pairs = 10;

  // Shuffle Road 🌀
  if (currentLevel >= 501) {
    pairs = 8;
    time = 95;
  }

  if (currentLevel >= 701) pairs = 8;
  if (currentLevel >= 901) pairs = 10;

  // Chaos Carnival 🎪
  if (currentLevel >= 1001) {
    pairs = 8;
    time = 90;
    previewTime = 1900;
  }

  if (currentLevel >= 1201) pairs = 9;
  if (currentLevel >= 1401) pairs = 11;

  // Time Rift ⏳
  if (currentLevel >= 1501) {
    pairs = 9;
    time = 90;
    previewTime = 1800;
  }

  if (currentLevel >= 1701) pairs = 10;
  if (currentLevel >= 1901) pairs = 12;

  // Mirror Maze 🪞
  if (currentLevel >= 2001) {
    pairs = 10;
    time = 85;
  }

  if (currentLevel >= 2201) pairs = 11;
  if (currentLevel >= 2401) pairs = 13;

  // Phantom Woods 👻
  if (currentLevel >= 2501) {
    pairs = 10;
    time = 85;
    previewTime = 2000;
  }

  if (currentLevel >= 2701) pairs = 12;
  if (currentLevel >= 2901) pairs = 14;

  // Storm Highway 🌪️
  if (currentLevel >= 3001) {
    pairs = 11;
    time = 80;
  }

  if (currentLevel >= 3201) pairs = 13;
  if (currentLevel >= 3401) pairs = 15;

  // Nightmare District 😈
  if (currentLevel >= 3501) {
    pairs = 11;
    time = 80;
    previewTime = 2300;
  }

  if (currentLevel >= 3701) pairs = 13;
  if (currentLevel >= 3901) pairs = 16;

  // Boss Road 👑
  if (currentLevel >= 4001) {
    pairs = 12;
    time = 75;
  }

  if (currentLevel >= 4201) pairs = 14;
  if (currentLevel >= 4401) pairs = 16;

  // Final Dream 💗
  if (currentLevel >= 4501) {
    pairs = 12;
    time = 75;
    previewTime = 2500;
  }

  if (currentLevel >= 4751) {
    pairs = 14;
  }

  // -----------------------------
  // SPECIAL FEATURES
  // -----------------------------

  const v2 = currentLevel >= 101;

  // Plenty of lives — this is supposed to be fun 😭
  const lives = v2 ? 5 : null;

  // Hints
  const hints = v2 ? 3 : null;

  // Special cards appear gradually
  const bloomPairs = currentLevel >= 101 ? 1 : 0;

  const dewPairs = currentLevel >= 301 ? 1 : 0;

  const stormPairs = currentLevel >= 3001 ? 1 : 0;

  const thornCards = currentLevel >= 1001 ? 1 : 0;

  // Shuffle starts much later
  const shuffleEvery = currentLevel >= 501 ? 5 : 0;

  // Blackout starts only in later chapters
  const blackoutEvery = currentLevel >= 3001 ? 8 : 0;

  // Small penalty
  const wrongTimePenalty = currentLevel >= 101 ? 2 : 0;

  const dewBonus = currentLevel >= 101 ? 8 : 5;

  // Boss every 100 levels instead of every 50
  const boss = currentLevel >= 4001 && currentLevel % 100 === 0;

  // Bosses are only slightly harder
  if (boss) {
    time = Math.max(60, time - 5);
  }

  return {
    level: currentLevel,
    garden,

    pairs,
    time,
    previewTime,

    lives,
    hints,

    bloomPairs,
    dewPairs,
    stormPairs,
    thornCards,

    shuffleEvery,
    blackoutEvery,

    wrongTimePenalty,
    dewBonus,

    boss,
    v2,
  };
}

/* -------------------------------------------------------
   DAILY GAME
------------------------------------------------------- */

export function getDailyConfig(seed) {
  const pairs = 6 + (Math.abs(seed) % 4);

  return {
    level: 0,

    garden: GARDENS[Math.abs(seed) % GARDENS.length],

    pairs,

    time: 70,
    previewTime: 1100,

    lives: 3,
    hints: 2,

    bloomPairs: 1,
    dewPairs: 1,

    stormPairs: seed % 3 === 0 ? 1 : 0,

    thornCards: seed % 2 === 0 ? 1 : 0,

    shuffleEvery: 0,
    blackoutEvery: 0,

    wrongTimePenalty: 0,

    dewBonus: 6,

    boss: false,
    v2: true,
  };
}

/* -------------------------------------------------------
   BOARD SIZE
------------------------------------------------------- */

export function getBoardColumns(cardCount, width) {
  const maxColumns = width < 420 ? 4 : width < 720 ? 5 : 6;

  if (cardCount <= 6) {
    return Math.min(3, maxColumns);
  }

  if (cardCount <= 12) {
    return Math.min(4, maxColumns);
  }

  if (cardCount <= 20) {
    return Math.min(5, maxColumns);
  }

  return maxColumns;
}

export function getBoardRows(cardCount, columns) {
  return Math.ceil(cardCount / Math.max(1, columns));
}

/* -------------------------------------------------------
   DAILY SEED
------------------------------------------------------- */

export function todayKey(date = new Date()) {
  const y = date.getFullYear();

  const m = String(date.getMonth() + 1).padStart(2, "0");

  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

export function seedFromKey(key) {
  let hash = 2166136261;

  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);

    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash);
}
