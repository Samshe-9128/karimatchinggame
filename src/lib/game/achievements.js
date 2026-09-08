import { GARDENS, MAX_LEVEL } from "./config";
export function listAchievements(save) {
    const done = new Set(save.completed);
    const gardensCleared = GARDENS.filter((g) => {
        for (let n = g.from; n <= g.to; n += 1) {
            if (!done.has(n))
                return false;
        }
        return true;
    }).length;
    return [
        {
            id: "first-pair",
            title: "First pair",
            hint: "Finish a stop on the path.",
            unlocked: done.size >= 1,
        },
        {
            id: "dew",
            title: "Dew keeper",
            hint: "Walk all of Dew Garden.",
            unlocked: gardensCleared >= 1,
        },
        {
            id: "combo",
            title: "Quiet streak",
            hint: "Reach a 6x combo.",
            unlocked: save.stats.bestCombo >= 6,
        },
        {
            id: "perfect",
            title: "No extra turns",
            hint: "Clear a stop in perfect moves.",
            unlocked: save.stats.perfectLevels >= 1,
        },
        {
            id: "daily",
            title: "Morning bloom",
            hint: "Finish today's bloom.",
            unlocked: save.stats.dailies >= 1,
        },
        {
            id: "iris",
            title: "Spoke with Iris",
            hint: "Ask Iris anything.",
            unlocked: save.stats.talkedToIris >= 1,
        },
        {
            id: "collect",
            title: "Pressed flowers",
            hint: "Collect 16 motifs.",
            unlocked: save.collection.length >= 16,
        },
        {
            id: "half",
            title: "Halfway light",
            hint: "Complete 60 stops.",
            unlocked: done.size >= 60,
        },
        {
            id: "sanctuary",
            title: "Sanctuary",
            hint: "Finish the last garden.",
            unlocked: done.has(MAX_LEVEL),
        },
        {
            id: "calm",
            title: "Unhurried",
            hint: "Play a stop in Calm Path.",
            unlocked: save.settings.calm && done.size >= 1,
        },
        {
            id: "streak",
            title: "Three mornings",
            hint: "A 3-day bloom streak.",
            unlocked: save.dailyStreak >= 3,
        },
        {
            id: "all-gardens",
            title: "Whole path",
            hint: "Clear every garden.",
            unlocked: gardensCleared >= GARDENS.length,
        },
    ];
}
