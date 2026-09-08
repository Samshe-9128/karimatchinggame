import { getDailyConfig, getLevelConfig, seedFromKey } from "./config.js";
import { MOTIFS } from "./motifs.js";
function shuffleIn(array, rand) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rand() * (i + 1));
        const a = result[i];
        result[i] = result[j];
        result[j] = a;
    }
    return result;
}
function uniqueIndexes(count, max, rand) {
    const picked = [];
    let guard = 0;
    while (picked.length < Math.min(count, max) && guard < 400) {
        guard += 1;
        const n = Math.floor(rand() * max);
        if (!picked.includes(n))
            picked.push(n);
    }
    return picked;
}
function makeRand(seed) {
    if (seed === undefined)
        return Math.random;
    let s = seed % 2147483647;
    if (s <= 0)
        s += 2147483646;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}
function buildDeck(config, rand) {
    const needed = Math.min(MOTIFS.length, config.pairs);
    const motifs = shuffleIn(MOTIFS, rand).slice(0, needed);
    const bloom = new Set(uniqueIndexes(config.bloomPairs, config.pairs, rand));
    const dew = new Set(uniqueIndexes(config.dewPairs, config.pairs, rand).filter((id) => !bloom.has(id)));
    const storm = new Set(uniqueIndexes(config.stormPairs, config.pairs, rand).filter((id) => !bloom.has(id) && !dew.has(id)));
    const deck = [];
    motifs.forEach((motif, pairId) => {
        let special = null;
        if (bloom.has(pairId))
            special = "bloom";
        else if (dew.has(pairId))
            special = "dew";
        else if (storm.has(pairId))
            special = "storm";
        const stamp = `${config.level}-${pairId}`;
        deck.push({
            id: `${stamp}-a-${rand().toString(36).slice(2, 8)}`,
            pairId,
            motifId: motif.id,
            emoji: motif.emoji,
            special,
            trap: false,
        });
        deck.push({
            id: `${stamp}-b-${rand().toString(36).slice(2, 8)}`,
            pairId,
            motifId: motif.id,
            emoji: motif.emoji,
            special,
            trap: false,
        });
    });
    for (let i = 0; i < config.thornCards; i += 1) {
        const trapMotif = shuffleIn(MOTIFS, rand)[0];
        deck.push({
            id: `${config.level}-thorn-${i}-${rand().toString(36).slice(2, 8)}`,
            pairId: null,
            motifId: trapMotif.id,
            emoji: trapMotif.emoji,
            special: "thorn",
            trap: true,
        });
    }
    return shuffleIn(deck, rand);
}
export function createDeck(levelNumber) {
    return buildDeck(getLevelConfig(levelNumber), makeRand());
}
export function createDailyDeck(dateKey) {
    const seed = seedFromKey(dateKey);
    return buildDeck(getDailyConfig(seed), makeRand(seed));
}
export function shuffleDeck(cards) {
    return shuffleIn(cards, Math.random);
}
