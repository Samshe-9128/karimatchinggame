import { EMOJIS } from "../data/emojis";
import { shuffle } from "./shuffle";
import { getLevelConfig } from "./gameConfig";

function pickUniqueNumbers(count, max) {
  const numbers = [];

  while (numbers.length < count) {
    const number = Math.floor(Math.random() * max);

    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }

  return numbers;
}

export function createDeck(levelNumber) {
  const config = getLevelConfig(levelNumber);

  const neededEmojis = Math.min(EMOJIS.length, config.pairs);

  const emojis = shuffle(EMOJIS).slice(0, neededEmojis);

  const goldenIds = new Set(
    pickUniqueNumbers(Math.min(config.goldenPairs, config.pairs), config.pairs),
  );

  const freezeCandidates = pickUniqueNumbers(
    Math.min(config.freezePairs, config.pairs),
    config.pairs,
  );

  const freezeIds = new Set(
    freezeCandidates.filter((id) => !goldenIds.has(id)),
  );

  const bombCandidates = pickUniqueNumbers(
    Math.min(config.bombPairs, config.pairs),
    config.pairs,
  );

  const bombIds = new Set(
    bombCandidates.filter((id) => !goldenIds.has(id) && !freezeIds.has(id)),
  );

  const deck = [];

  emojis.forEach((emoji, pairId) => {
    let special = null;

    if (goldenIds.has(pairId)) {
      special = "golden";
    } else if (freezeIds.has(pairId)) {
      special = "freeze";
    } else if (bombIds.has(pairId)) {
      special = "bomb";
    }

    deck.push({
      id: `${levelNumber}-${pairId}-a-${Math.random()}`,
      pairId,
      emoji,
      special,
      trap: false,
    });

    deck.push({
      id: `${levelNumber}-${pairId}-b-${Math.random()}`,
      pairId,
      emoji,
      special,
      trap: false,
    });
  });

  /*
   * Trap cards have no pair.
   * Kari must avoid them.
   */
  for (let index = 0; index < config.trapCards; index += 1) {
    const trapEmoji = shuffle(EMOJIS)[0];

    deck.push({
      id: `${levelNumber}-trap-${index}-${Math.random()}`,
      pairId: null,
      emoji: trapEmoji,
      special: "trap",
      trap: true,
    });
  }

  return shuffle(deck);
}

export function shuffleDeck(cards) {
  return shuffle(cards);
}
