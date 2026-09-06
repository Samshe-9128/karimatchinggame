import { useEffect, useMemo, useRef, useState } from "react";
import { readJSON, readStorage, writeStorage } from "../utils/storage";
import { MAX_LEVEL, getLevelConfig } from "../utils/gameConfig";
import { createDeck, shuffleDeck } from "../utils/deck";
import { getLevelMessage } from "../data/levelMessages";

export default function useMemoryGame() {
  // ----------------------------------------------------
  // PROGRESS
  // ----------------------------------------------------
  const [highestUnlocked, setHighestUnlocked] = useState(() => {
    const saved = Number(readStorage("kari-memory-highest-level", "1"));
    return Math.min(MAX_LEVEL, Math.max(1, Math.floor(saved)));
  });

  const [completedLevels, setCompletedLevels] = useState(() => {
    const saved = readJSON("kari-memory-completed-levels", []);
    return new Set(
      Array.isArray(saved)
        ? saved.filter(
            (value) =>
              Number.isInteger(value) && value >= 1 && value <= MAX_LEVEL,
          )
        : [],
    );
  });

  // ----------------------------------------------------
  // STATS
  // ----------------------------------------------------
  const [stats, setStats] = useState(() => {
    const saved = readJSON("kari-memory-stats", {});
    return {
      totalMatches: Number(saved.totalMatches) || 0,
      bestCombo: Number(saved.bestCombo) || 0,
      hintsUsed: Number(saved.hintsUsed) || 0,
      failedLevels: Number(saved.failedLevels) || 0,
      perfectLevels: Number(saved.perfectLevels) || 0,
      totalScore: Number(saved.totalScore) || 0,
    };
  });

  // ----------------------------------------------------
  // SCREEN
  // ----------------------------------------------------
  const [screen, setScreen] = useState("map");
  const [level, setLevel] = useState(() => {
    const saved = Number(readStorage("kari-memory-highest-level", "1"));
    return Math.min(MAX_LEVEL, Math.max(1, Math.floor(saved)));
  });

  // ----------------------------------------------------
  // BOARD
  // ----------------------------------------------------
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [trapped, setTrapped] = useState([]);

  // ----------------------------------------------------
  // GAME STATS
  // ----------------------------------------------------
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(null);
  const [hints, setHints] = useState(null);

  // ----------------------------------------------------
  // STATUS
  // ----------------------------------------------------
  const [previewing, setPreviewing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hinting, setHinting] = useState([]);
  const [blackout, setBlackout] = useState(false);
  const [hiddenMessage, setHiddenMessage] = useState("");
  const [traveling, setTraveling] = useState(false);

  // ----------------------------------------------------
  // REFS
  // ----------------------------------------------------
  const flippedRef = useRef([]);
  const matchedRef = useRef(new Set());
  const checkingRef = useRef(false);
  const activeRef = useRef(false);
  const timeLeftRef = useRef(null);
  const livesRef = useRef(null);
  const comboRef = useRef(0);
  const hintsRef = useRef(null);
  const unlockedRef = useRef(highestUnlocked);
  const sessionRef = useRef(0);
  const travelLockRef = useRef(false);

  // ----------------------------------------------------
  // TIMERS
  // ----------------------------------------------------
  const previewTimerRef = useRef(null);
  const mismatchTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const completeTimerRef = useRef(null);
  const travelTimerRef = useRef(null);
  const hintTimerRef = useRef(null);
  const blackoutTimerRef = useRef(null);

  // ----------------------------------------------------
  // CONFIG
  // ----------------------------------------------------
  const config = useMemo(() => getLevelConfig(level), [level]);

  // ----------------------------------------------------
  // SAVE PROGRESS
  // ----------------------------------------------------
  useEffect(() => {
    unlockedRef.current = highestUnlocked;
    writeStorage("kari-memory-highest-level", String(highestUnlocked));
  }, [highestUnlocked]);

  useEffect(() => {
    writeStorage(
      "kari-memory-completed-levels",
      JSON.stringify(Array.from(completedLevels).sort((a, b) => a - b)),
    );
  }, [completedLevels]);

  useEffect(() => {
    writeStorage("kari-memory-stats", JSON.stringify(stats));
  }, [stats]);

  // ----------------------------------------------------
  // CLEANUP
  // ----------------------------------------------------
  function clearTimers() {
    clearTimeout(previewTimerRef.current);
    clearTimeout(mismatchTimerRef.current);
    clearTimeout(completeTimerRef.current);
    clearTimeout(travelTimerRef.current);
    clearTimeout(hintTimerRef.current);
    clearTimeout(blackoutTimerRef.current);
    clearInterval(countdownTimerRef.current);
  }

  // ----------------------------------------------------
  // SHUFFLE BOARD
  // ----------------------------------------------------
  function shuffleCurrentBoard() {
    setCards((current) => shuffleDeck(current));
  }

  // ----------------------------------------------------
  // BLACKOUT
  // ----------------------------------------------------
  function triggerBlackout() {
    if (!config.blackoutEvery || !activeRef.current) {
      return;
    }
    clearTimeout(blackoutTimerRef.current);
    setBlackout(true);
    blackoutTimerRef.current = setTimeout(() => {
      setBlackout(false);
    }, 650);
  }

  // ----------------------------------------------------
  // LOSE GAME
  // ----------------------------------------------------
  function loseGame() {
    clearTimers();
    activeRef.current = false;
    checkingRef.current = false;
    flippedRef.current = [];
    setFlipped([]);
    setChecking(false);
    setPreviewing(false);
    setHinting([]);
    setBlackout(false);
    setStats((previous) => ({
      ...previous,
      failedLevels: previous.failedLevels + 1,
    }));
    setScreen("lost");
  }

  // ----------------------------------------------------
  // LOSE LIFE
  // ----------------------------------------------------
  function loseLife() {
    if (livesRef.current === null) {
      loseGame();
      return false;
    }
    const nextLives = Math.max(0, livesRef.current - 1);
    livesRef.current = nextLives;
    setLives(nextLives);
    comboRef.current = 0;
    setCombo(0);
    if (nextLives <= 0) {
      loseGame();
      return false;
    }
    return true;
  }

  // ----------------------------------------------------
  // COUNTDOWN
  // ----------------------------------------------------
  function startCountdown(seconds, session) {
    clearInterval(countdownTimerRef.current);
    timeLeftRef.current = seconds;
    setTimeLeft(seconds);
    countdownTimerRef.current = setInterval(() => {
      if (sessionRef.current !== session) {
        clearInterval(countdownTimerRef.current);
        return;
      }
      const next = Math.max(0, (timeLeftRef.current ?? seconds) - 1);
      timeLeftRef.current = next;
      setTimeLeft(next);
      if (next <= 0) {
        clearInterval(countdownTimerRef.current);
        if (config.v2 && livesRef.current !== null) {
          const survived = loseLife();
          if (!survived) return;
          startFreshRound(sessionRef.current);
          return;
        }
        loseGame();
      }
    }, 1000);
  }

  // ----------------------------------------------------
  // START FRESH ROUND (used in time-based levels)
  // ----------------------------------------------------
  function startFreshRound(existingSession) {
    const newDeck = createDeck(level);
    flippedRef.current = newDeck.map((card) => card.id);
    matchedRef.current = new Set();
    setCards(newDeck);
    setMatched(new Set());
    setFlipped(flippedRef.current);
    setChecking(false);
    checkingRef.current = false;
    setPreviewing(true);
    timeLeftRef.current = config.time;
    setTimeLeft(config.time);
    previewTimerRef.current = setTimeout(() => {
      if (sessionRef.current !== existingSession) return;
      flippedRef.current = [];
      setFlipped([]);
      setPreviewing(false);
      if (config.time !== null) {
        startCountdown(config.time, existingSession);
      }
    }, config.previewTime);
  }

  // ----------------------------------------------------
  // START LEVEL
  // ----------------------------------------------------
  function startLevel(levelNumber, bypassLock = false) {
    if (levelNumber < 1 || levelNumber > MAX_LEVEL) return;
    if (!bypassLock && levelNumber > unlockedRef.current) return;

    clearTimers();
    sessionRef.current += 1;
    const session = sessionRef.current;
    const levelConfig = getLevelConfig(levelNumber);
    const deck = createDeck(levelNumber);

    activeRef.current = true;
    checkingRef.current = false;
    flippedRef.current = deck.map((card) => card.id);
    matchedRef.current = new Set();
    livesRef.current = levelConfig.lives;
    comboRef.current = 0;
    hintsRef.current = levelConfig.hints;

    setLevel(levelNumber);
    setCards(deck);
    setFlipped(flippedRef.current);
    setMatched(new Set());
    setTrapped([]);
    setMoves(0);
    setScore(0);
    setCombo(0);
    setLives(levelConfig.lives);
    setHints(levelConfig.hints);
    setHinting([]);
    setBlackout(false);
    setChecking(false);
    setPreviewing(true);
    setHiddenMessage("");
    setTimeLeft(levelConfig.time);
    timeLeftRef.current = levelConfig.time;
    setScreen("game");

    previewTimerRef.current = setTimeout(() => {
      if (sessionRef.current !== session) return;
      flippedRef.current = [];
      setFlipped([]);
      setPreviewing(false);
      if (levelConfig.time !== null) {
        startCountdown(levelConfig.time, session);
      }
    }, levelConfig.previewTime);
  }

  // ----------------------------------------------------
  // HINT
  // ----------------------------------------------------
  function useHint() {
    if (!config.v2) return;
    if (hintsRef.current === null || hintsRef.current <= 0) return;
    if (previewing || checking || blackout || !activeRef.current) return;

    const available = cards.filter(
      (card) => !matchedRef.current.has(card.id) && !card.trap,
    );
    const groups = new Map();
    available.forEach((card) => {
      if (!groups.has(card.pairId)) {
        groups.set(card.pairId, []);
      }
      groups.get(card.pairId).push(card);
    });
    const pairs = Array.from(groups.values()).filter(
      (pair) => pair.length === 2,
    );
    if (!pairs.length) return;

    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const ids = pair.map((card) => card.id);
    const nextHints = hintsRef.current - 1;
    hintsRef.current = nextHints;
    setHints(nextHints);
    setScore((previous) => Math.max(0, previous - 50));
    setHinting(ids);
    setStats((previous) => ({
      ...previous,
      hintsUsed: previous.hintsUsed + 1,
    }));

    const session = sessionRef.current;
    clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => {
      if (sessionRef.current === session) {
        setHinting([]);
      }
    }, 1200);
  }

  // ----------------------------------------------------
  // MATCH SCORE
  // ----------------------------------------------------
  function calculateMatchScore(firstCard, nextCombo) {
    let points = 100 + nextCombo * 25;
    if (level >= 101) {
      points += Math.floor(level / 25);
    }
    if (firstCard.special === "golden") {
      points += 150;
    }
    if (firstCard.special === "freeze") {
      points += 50;
    }
    if (firstCard.special === "bomb") {
      points -= 75;
    }
    return Math.max(25, points);
  }

  // ----------------------------------------------------
  // APPLY SPECIAL CARD
  // ----------------------------------------------------
  function applySpecialCard(card) {
    if (card.special === "freeze") {
      if (timeLeftRef.current !== null) {
        const nextTime = timeLeftRef.current + config.freezeBonus;
        timeLeftRef.current = nextTime;
        setTimeLeft(nextTime);
      }
    }
    if (card.special === "bomb") {
      if (timeLeftRef.current !== null) {
        const nextTime = Math.max(0, timeLeftRef.current - 3);
        timeLeftRef.current = nextTime;
        setTimeLeft(nextTime);
      }
      comboRef.current = 0;
      setCombo(0);
    }
  }

  // ----------------------------------------------------
  // CARD CLICK
  // ----------------------------------------------------
  function handleCardClick(cardId) {
    if (!activeRef.current || previewing || checking || blackout) return;
    if (hinting.includes(cardId)) return;
    if (flippedRef.current.includes(cardId)) return;
    if (matchedRef.current.has(cardId)) return;
    if (flippedRef.current.length >= 2) return;

    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard) return;

    // TRAP
    if (clickedCard.trap) {
      flippedRef.current = [...flippedRef.current, cardId];
      setFlipped(flippedRef.current);
      checkingRef.current = true;
      setChecking(true);
      setMoves((value) => value + 1);
      const session = sessionRef.current;
      setTrapped((previous) => [...previous, cardId]);
      setScore((value) => Math.max(0, value - 100));
      loseLife();
      setTimeout(() => {
        if (sessionRef.current !== session) return;
        flippedRef.current = [];
        setFlipped([]);
        checkingRef.current = false;
        setChecking(false);
        if (config.shuffleEvery) {
          shuffleCurrentBoard();
        }
      }, 700);
      return;
    }

    const nextFlipped = [...flippedRef.current, cardId];
    flippedRef.current = nextFlipped;
    setFlipped(nextFlipped);
    if (nextFlipped.length === 1) return;

    const firstId = nextFlipped[0];
    const secondId = nextFlipped[1];
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);
    if (!firstCard || !secondCard) {
      flippedRef.current = [];
      setFlipped([]);
      return;
    }

    checkingRef.current = true;
    setChecking(true);
    const nextMove = moves + 1;
    setMoves(nextMove);
    const session = sessionRef.current;
    const isMatch = firstCard.pairId === secondCard.pairId;

    // MATCH
    if (isMatch) {
      const updated = new Set(matchedRef.current);
      updated.add(firstId);
      updated.add(secondId);
      matchedRef.current = updated;
      setMatched(new Set(updated));

      const nextCombo = config.v2 ? comboRef.current + 1 : 0;
      comboRef.current = nextCombo;
      setCombo(nextCombo);
      const points = calculateMatchScore(firstCard, nextCombo);
      setScore((value) => value + points);
      setStats((previous) => ({
        ...previous,
        totalMatches: previous.totalMatches + 1,
        bestCombo: Math.max(previous.bestCombo, nextCombo),
      }));
      applySpecialCard(firstCard);

      if (config.blackoutEvery && nextMove % config.blackoutEvery === 0) {
        setTimeout(triggerBlackout, 280);
      }

      mismatchTimerRef.current = setTimeout(() => {
        if (sessionRef.current !== session) return;
        const matchedPairs = updated.size / 2;
        const finished = matchedPairs >= config.pairs;
        if (finished) {
          completeLevel(session);
          return;
        }
        flippedRef.current = [];
        setFlipped([]);
        checkingRef.current = false;
        setChecking(false);
        if (config.shuffleEvery && nextMove % config.shuffleEvery === 0) {
          shuffleCurrentBoard();
        }
      }, 280);
      return;
    }

    // WRONG MATCH
    mismatchTimerRef.current = setTimeout(() => {
      if (sessionRef.current !== session) return;
      if (config.v2) {
        const survived = loseLife();
        if (!survived) return;
      }
      if (config.wrongTimePenalty > 0) {
        const nextTime = Math.max(
          0,
          (timeLeftRef.current ?? 0) - config.wrongTimePenalty,
        );
        timeLeftRef.current = nextTime;
        setTimeLeft(nextTime);
        if (nextTime <= 0) {
          loseGame();
          return;
        }
      }
      flippedRef.current = [];
      setFlipped([]);
      checkingRef.current = false;
      setChecking(false);
      if (config.shuffleEvery && nextMove % config.shuffleEvery === 0) {
        shuffleCurrentBoard();
      }
      if (config.blackoutEvery && nextMove % config.blackoutEvery === 0) {
        triggerBlackout();
      }
    }, 650);
  }

  // ----------------------------------------------------
  // COMPLETE
  // ----------------------------------------------------
  function completeLevel(session) {
    if (sessionRef.current !== session || !activeRef.current) return;

    activeRef.current = false;
    checkingRef.current = false;
    clearInterval(countdownTimerRef.current);
    clearTimeout(mismatchTimerRef.current);
    setChecking(false);
    setBlackout(false);

    const perfect = moves <= config.pairs;
    setCompletedLevels((previous) => {
      const next = new Set(previous);
      next.add(level);
      return next;
    });

    setStats((previous) => ({
      ...previous,
      totalScore: previous.totalScore + score,
      perfectLevels: previous.perfectLevels + (perfect ? 1 : 0),
    }));

    if (level < MAX_LEVEL) {
      setHighestUnlocked((previous) => {
        const next = Math.max(previous, level + 1);
        unlockedRef.current = next;
        return next;
      });
    }

    setHiddenMessage(getLevelMessage(level));
    completeTimerRef.current = setTimeout(() => {
      if (sessionRef.current === session) {
        setScreen("complete");
      }
    }, 450);
  }

  // ----------------------------------------------------
  // NEXT LEVEL
  // ----------------------------------------------------
  function goToNextLevel() {
    if (travelLockRef.current || level >= MAX_LEVEL) return;
    const nextLevel = level + 1;
    if (nextLevel > unlockedRef.current) return;
    travelLockRef.current = true;
    setTraveling(true);
    const session = sessionRef.current;
    travelTimerRef.current = setTimeout(() => {
      if (sessionRef.current !== session) {
        travelLockRef.current = false;
        setTraveling(false);
        return;
      }
      travelLockRef.current = false;
      setTraveling(false);
      startLevel(nextLevel, true);
    }, 1200);
  }

  // ----------------------------------------------------
  // BACK TO MAP
  // ----------------------------------------------------
  function backToMap() {
    clearTimers();
    sessionRef.current += 1;
    activeRef.current = false;
    checkingRef.current = false;
    flippedRef.current = [];
    matchedRef.current = new Set();
    travelLockRef.current = false;
    setTraveling(false);
    setPreviewing(false);
    setChecking(false);
    setFlipped([]);
    setMatched(new Set());
    setTrapped([]);
    setHinting([]);
    setBlackout(false);
    setTimeLeft(null);
    timeLeftRef.current = null;
    setLives(null);
    livesRef.current = null;
    setHints(null);
    hintsRef.current = null;
    setCombo(0);
    comboRef.current = 0;
    setScreen("map");
  }

  // ----------------------------------------------------
  // STATS SCREEN
  // ----------------------------------------------------
  function openStats() {
    clearTimers();
    activeRef.current = false;
    checkingRef.current = false;
    setScreen("stats");
  }

  // ----------------------------------------------------
  // RESTART LEVEL (new)
  // ----------------------------------------------------
  function restartLevel() {
    // Restart the current level, bypassing any lock (level is already unlocked)
    startLevel(level, true);
  }

  // ----------------------------------------------------
  // CLEANUP
  // ----------------------------------------------------
  useEffect(() => {
    return () => {
      clearTimers();
      activeRef.current = false;
    };
  }, []);

  // ----------------------------------------------------
  // RETURN
  // ----------------------------------------------------
  return {
    screen,
    highestUnlocked,
    completedLevels,
    stats,
    level,
    cards,
    flipped,
    matched,
    trapped,
    moves,
    score,
    combo,
    lives,
    hints,
    previewing,
    checking,
    timeLeft,
    hinting,
    blackout,
    hiddenMessage,
    traveling,
    config,
    startLevel,
    handleCardClick,
    useHint,
    goToNextLevel,
    backToMap,
    openStats,
    restartLevel, // <-- added
  };
}
