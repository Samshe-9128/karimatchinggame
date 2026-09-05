export const MAX_LEVEL = 5000;

export function getVersion(level) {
  if (level <= 100) {
    return {
      id: 1,
      name: "Classic",
      emoji: "🌸",
      min: 1,
      max: 100,
    };
  }

  if (level <= 500) {
    return {
      id: 2,
      name: "Secret Garden",
      emoji: "🌷",
      min: 101,
      max: 500,
    };
  }

  if (level <= 1000) {
    return {
      id: 3,
      name: "Shuffle Road",
      emoji: "🌀",
      min: 501,
      max: 1000,
    };
  }

  if (level <= 1500) {
    return {
      id: 4,
      name: "Chaos Carnival",
      emoji: "🎪",
      min: 1001,
      max: 1500,
    };
  }

  if (level <= 2000) {
    return {
      id: 5,
      name: "Time Rift",
      emoji: "⏳",
      min: 1501,
      max: 2000,
    };
  }

  if (level <= 2500) {
    return {
      id: 6,
      name: "Mirror Maze",
      emoji: "🪞",
      min: 2001,
      max: 2500,
    };
  }

  if (level <= 3000) {
    return {
      id: 7,
      name: "Phantom Woods",
      emoji: "👻",
      min: 2501,
      max: 3000,
    };
  }

  if (level <= 3500) {
    return {
      id: 8,
      name: "Storm Highway",
      emoji: "🌪️",
      min: 3001,
      max: 3500,
    };
  }

  if (level <= 4000) {
    return {
      id: 9,
      name: "Nightmare District",
      emoji: "😈",
      min: 3501,
      max: 4000,
    };
  }

  if (level <= 4500) {
    return {
      id: 10,
      name: "Boss Road",
      emoji: "👑",
      min: 4001,
      max: 4500,
    };
  }

  return {
    id: 11,
    name: "Final Dream",
    emoji: "💗",
    min: 4501,
    max: 5000,
  };
}

export function getLevelConfig(level) {
  const version = getVersion(level);

  let pairs;

  // Keep your original 1–100 progression.
  if (level <= 100) {
    pairs = Math.min(20, 3 + Math.floor((level - 1) / 6));
  } else {
    // Slowly increase board size after V1.
    pairs = Math.min(24, 20 + Math.floor((level - 101) / 400));
  }

  /*
   * Original timer
   */
  let time = null;

  if (level >= 6) time = 75;
  if (level >= 21) time = 70;
  if (level >= 31) time = 65;
  if (level >= 41) time = 60;
  if (level >= 61) time = 55;
  if (level >= 81) time = 50;

  /*
   * V2+
   */
  if (level >= 101) time = 50;
  if (level >= 501) time = 48;
  if (level >= 1001) time = 45;
  if (level >= 1501) time = 43;
  if (level >= 2001) time = 40;
  if (level >= 2501) time = 38;
  if (level >= 3001) time = 36;
  if (level >= 3501) time = 34;
  if (level >= 4001) time = 31;
  if (level >= 4501) time = 30;

  /*
   * Preview
   */
  let previewTime = 1200;

  if (level >= 31) previewTime = 1100;
  if (level >= 61) previewTime = 1000;
  if (level >= 81) previewTime = 900;

  if (level >= 101) previewTime = 850;
  if (level >= 501) previewTime = 800;
  if (level >= 1001) previewTime = 750;
  if (level >= 1501) previewTime = 700;
  if (level >= 2001) previewTime = 650;
  if (level >= 2501) previewTime = 600;
  if (level >= 3001) previewTime = 550;
  if (level >= 3501) previewTime = 500;
  if (level >= 4001) previewTime = 450;
  if (level >= 4501) previewTime = 400;

  /*
   * V2 mechanics
   */
  const v2 = level >= 101;

  let lives = null;
  let hints = null;

  if (level >= 101) {
    lives = 3;
    hints = 3;
  }

  if (level >= 2501) {
    lives = 2;
    hints = 2;
  }

  if (level >= 3501) {
    lives = 2;
    hints = 1;
  }

  /*
   * Special pairs
   */
  let goldenPairs = 0;
  let freezePairs = 0;
  let bombPairs = 0;
  let trapCards = 0;

  if (level >= 101) {
    goldenPairs = 1;
    freezePairs = 1;
  }

  if (level >= 1001) {
    bombPairs = 1;
    trapCards = 1;
  }

  if (level >= 1501) {
    bombPairs = 1;
    freezePairs = 1;
    trapCards = 2;
  }

  if (level >= 2501) {
    bombPairs = 2;
    trapCards = 3;
  }

  if (level >= 3501) {
    bombPairs = 2;
    trapCards = 3;
  }

  if (level >= 4001) {
    goldenPairs = 2;
    freezePairs = 1;
    bombPairs = 2;
    trapCards = 4;
  }

  if (level >= 4501) {
    goldenPairs = 2;
    freezePairs = 2;
    bombPairs = 1;
    trapCards = 2;
  }

  /*
   * Board modifiers
   */
  let shuffleEvery = 0;

  if (level >= 501) shuffleEvery = 4;
  if (level >= 2001) shuffleEvery = 3;
  if (level >= 3001) shuffleEvery = 3;
  if (level >= 3501) shuffleEvery = 2;
  if (level >= 4001) shuffleEvery = 2;
  if (level >= 4501) shuffleEvery = 2;

  let blackoutEvery = 0;

  if (level >= 3001) blackoutEvery = 5;
  if (level >= 3501) blackoutEvery = 4;
  if (level >= 4501) blackoutEvery = 4;

  let wrongTimePenalty = 0;

  if (level >= 1501) wrongTimePenalty = 2;
  if (level >= 3501) wrongTimePenalty = 4;
  if (level >= 4001) wrongTimePenalty = 5;

  let freezeBonus = 5;

  if (level >= 1501) freezeBonus = 6;
  if (level >= 3001) freezeBonus = 7;
  if (level >= 4501) freezeBonus = 8;

  const boss = level >= 4001 && level % 50 === 0;

  return {
    level,
    version,

    pairs,
    time,
    previewTime,

    v2,

    lives,
    hints,

    goldenPairs,
    freezePairs,
    bombPairs,
    trapCards,

    shuffleEvery,
    blackoutEvery,
    wrongTimePenalty,
    freezeBonus,

    boss,
  };
}

export function getDifficulty(level) {
  if (level >= 4501) return "Final Dream";
  if (level >= 4001) return "Boss";
  if (level >= 3501) return "Nightmare";
  if (level >= 3001) return "Storm";
  if (level >= 2501) return "Phantom";
  if (level >= 2001) return "Mirror";
  if (level >= 1501) return "Time Rift";
  if (level >= 1001) return "Chaos";
  if (level >= 501) return "Shuffle";
  if (level >= 101) return "Insane+";
  if (level >= 81) return "Insane";
  if (level >= 61) return "Expert";
  if (level >= 41) return "Hard";
  if (level >= 21) return "Medium";

  return "Easy";
}

export function getBoardColumns(pairs) {
  if (pairs >= 17) return 8;
  if (pairs >= 13) return 8;
  if (pairs >= 9) return 6;

  return 4;
}

export function getBoardRows(cardCount, columns) {
  return Math.ceil(cardCount / columns);
}
