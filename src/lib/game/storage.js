import { MAX_LEVEL, SAVE_VERSION, STORAGE_KEY, LEGACY_KEYS } from "./config.js";
export const defaultStats = () => ({
  totalMatches: 0,
  bestCombo: 0,
  hintsUsed: 0,
  restCount: 0,
  perfectLevels: 0,
  totalScore: 0,
  dailies: 0,
  talkedToIris: 0,
  longestStreak: 0,
});
export const defaultSettings = () => ({
  music: 0.45,
  sfx: 0.7,
  calm: false,
  notes: true,
  reducedMotion: false,
});
export const defaultSave = () => ({
  version: SAVE_VERSION,
  name: "Kari X sam",
  highestUnlocked: 1,
  completed: [],
  stats: defaultStats(),
  collection: [],
  settings: defaultSettings(),
  lastDaily: null,
  dailyStreak: 0,
  lastPlayDate: null,
});
function numbers(values) {
  return Array.isArray(values)
    ? values
        .map(Number)
        .filter((n) => Number.isInteger(n) && n >= 1 && n <= MAX_LEVEL)
    : [];
}
function migrate(raw = {}) {
  const base = defaultSave();
  const completed = [...new Set(numbers(raw.completed))].sort((a, b) => a - b);
  const stats = {
    ...base.stats,
    ...(raw.stats && typeof raw.stats === "object" ? raw.stats : {}),
  };
  if (
    Number.isFinite(Number(stats.failedLevels)) &&
    !Number.isFinite(Number(stats.restCount))
  )
    stats.restCount = Number(stats.failedLevels);
  return {
    ...base,
    ...raw,
    version: SAVE_VERSION,
    name:
      typeof raw.name === "string" && raw.name.trim()
        ? raw.name.trim().slice(0, 24)
        : base.name,
    highestUnlocked: Math.min(
      MAX_LEVEL,
      Math.max(1, Math.floor(Number(raw.highestUnlocked) || 1)),
    ),
    completed,
    stats,
    collection: Array.isArray(raw.collection)
      ? [...new Set(raw.collection.filter((x) => typeof x === "string"))]
      : [],
    settings: {
      ...base.settings,
      ...(raw.settings && typeof raw.settings === "object" ? raw.settings : {}),
    },
  };
}
function safeRead(key) {
  try {
    const x = localStorage.getItem(key);
    return x ? JSON.parse(x) : null;
  } catch {
    return null;
  }
}
export function loadSave() {
  const current = safeRead(STORAGE_KEY);
  const legacy = safeRead("bloom-path-save-v1");
  const oldHighest =
    Number(localStorage.getItem("kari-memory-highest-level")) || 1;
  const oldCompleted = safeRead("kari-memory-completed-levels");
  const oldStats = safeRead("kari-memory-stats");
  const sources = [legacy, current].filter(Boolean);
  let merged = defaultSave();
  for (const raw of sources) {
    const m = migrate(raw);
    merged = {
      ...merged,
      ...m,
      highestUnlocked: Math.max(merged.highestUnlocked, m.highestUnlocked),
      completed: [...new Set([...merged.completed, ...m.completed])].sort(
        (a, b) => a - b,
      ),
      stats: { ...merged.stats, ...m.stats },
      collection: [...new Set([...merged.collection, ...m.collection])],
      settings: { ...merged.settings, ...m.settings },
    };
  }
  merged.highestUnlocked = Math.min(
    MAX_LEVEL,
    Math.max(1, merged.highestUnlocked, oldHighest),
  );
  merged.completed = [
    ...new Set([...merged.completed, ...numbers(oldCompleted)]),
  ].sort((a, b) => a - b);
  if (oldStats && typeof oldStats === "object")
    merged.stats = {
      ...merged.stats,
      ...oldStats,
      restCount: Math.max(
        Number(merged.stats.restCount) || 0,
        Number(oldStats.failedLevels) || 0,
      ),
    };
  const oldMusic = localStorage.getItem("kari-memory-music");
  if (oldMusic !== null && !Number.isNaN(Number(oldMusic)))
    merged.settings.music = Math.max(0, Math.min(1, Number(oldMusic)));
  writeSave(merged);
  return merged;
}
export function writeSave(save) {
  try {
    const clean = migrate(save);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    localStorage.setItem("bloom-path-save-v1", JSON.stringify(clean));
    localStorage.setItem(
      "kari-memory-highest-level",
      String(clean.highestUnlocked),
    );
    localStorage.setItem(
      "kari-memory-completed-levels",
      JSON.stringify(clean.completed),
    );
    localStorage.setItem("kari-memory-stats", JSON.stringify(clean.stats));
    localStorage.setItem("kari-memory-music", String(clean.settings.music));
  } catch {}
}
export function exportSave(save) {
  const blob = new Blob([JSON.stringify(save, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kari-memory-road-save.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
export function importSaveFromText(text) {
  try {
    return migrate(JSON.parse(text));
  } catch {
    return null;
  }
}
