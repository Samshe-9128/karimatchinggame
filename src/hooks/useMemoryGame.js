import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GARDENS,
  getDailyConfig,
  getLevelConfig,
  MAX_LEVEL,
  seedFromKey,
  todayKey,
} from "../lib/game/config.js";
import { createDailyDeck, createDeck, shuffleDeck } from "../lib/game/deck.js";
import { getDailyNote, getLevelNote } from "../lib/game/messages.js";
import { defaultSave, loadSave, writeSave } from "../lib/game/storage.js";
import {
  playFlip,
  playHint,
  playMatch,
  playMiss,
  playRest,
  playWin,
} from "../lib/game/audio.js";
export function useMemoryGame() {
  const [hydrated, setHydrated] = useState(false);
  const [save, setSave] = useState(defaultSave);
  const [screen, setScreen] = useState("map");
  const [overlay, setOverlay] = useState("none");
  const [level, setLevel] = useState(1);
  const [isDaily, setIsDaily] = useState(false);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [trapped, setTrapped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(null);
  const [hints, setHints] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hinting, setHinting] = useState([]);
  const [blackout, setBlackout] = useState(false);
  const [hiddenMessage, setHiddenMessage] = useState("");
  const [traveling, setTraveling] = useState(false);
  const flippedRef = useRef([]);
  const matchedRef = useRef(new Set());
  const checkingRef = useRef(false);
  const activeRef = useRef(false);
  const timeLeftRef = useRef(null);
  const livesRef = useRef(null);
  const comboRef = useRef(0);
  const hintsRef = useRef(null);
  const unlockedRef = useRef(1);
  const sessionRef = useRef(0);
  const travelLockRef = useRef(false);
  const movesRef = useRef(0);
  const scoreRef = useRef(0);
  const cardsRef = useRef([]);
  const calmRef = useRef(false);
  const saveRef = useRef(save);
  const isDailyRef = useRef(false);
  const levelRef = useRef(1);
  const overlayRef = useRef("none");
  const previewTimerRef = useRef(null);
  const mismatchTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const completeTimerRef = useRef(null);
  const travelTimerRef = useRef(null);
  const hintTimerRef = useRef(null);
  const blackoutTimerRef = useRef(null);
  const config = useMemo(() => {
    if (isDaily) return getDailyConfig(seedFromKey(todayKey()));
    return getLevelConfig(level);
  }, [level, isDaily]);
  const persist = useCallback((next) => {
    saveRef.current = next;
    setSave(next);
    writeSave(next);
  }, []);
  useEffect(() => {
    const loaded = loadSave();
    saveRef.current = loaded;
    unlockedRef.current = loaded.highestUnlocked;
    calmRef.current = loaded.settings.calm;
    setSave(loaded);
    setLevel(loaded.highestUnlocked);
    setHydrated(true);
  }, []);
  useEffect(() => {
    saveRef.current = save;
    unlockedRef.current = save.highestUnlocked;
    calmRef.current = save.settings.calm;
  }, [save]);

  useEffect(() => {
    overlayRef.current = overlay;
  }, [overlay]);
  function clearTimers() {
    if (previewTimerRef.current) window.clearTimeout(previewTimerRef.current);
    if (mismatchTimerRef.current) window.clearTimeout(mismatchTimerRef.current);
    if (completeTimerRef.current) window.clearTimeout(completeTimerRef.current);
    if (travelTimerRef.current) window.clearTimeout(travelTimerRef.current);
    if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
    if (blackoutTimerRef.current) window.clearTimeout(blackoutTimerRef.current);
    if (countdownTimerRef.current)
      window.clearInterval(countdownTimerRef.current);
  }
  useEffect(() => {
    return () => {
      clearTimers();
      activeRef.current = false;
    };
  }, []);
  useEffect(() => {
    function onHide() {
      if (document.visibilityState === "hidden") {
        writeSave(saveRef.current);
      }
    }
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);
  const patchSettings = useCallback(
    (partial) => {
      const next = {
        ...saveRef.current,
        settings: { ...saveRef.current.settings, ...partial },
      };
      persist(next);
    },
    [persist],
  );
  const setName = useCallback(
    (name) => {
      persist({ ...saveRef.current, name: name.trim().slice(0, 24) });
    },
    [persist],
  );
  function replaceSave(next) {
    persist(next);
    unlockedRef.current = next.highestUnlocked;
    setLevel(next.highestUnlocked);
  }
  function shuffleCurrentBoard() {
    setCards((current) => {
      const next = shuffleDeck(current);
      cardsRef.current = next;
      return next;
    });
  }
  function triggerBlackout() {
    if (!config.blackoutEvery || !activeRef.current) return;
    if (blackoutTimerRef.current) window.clearTimeout(blackoutTimerRef.current);
    setBlackout(true);
    blackoutTimerRef.current = window.setTimeout(() => setBlackout(false), 700);
  }
  function loseGame() {
    if (calmRef.current) {
      startCountdown(Math.max(20, config.time ?? 40), sessionRef.current);
      return;
    }
    clearTimers();
    activeRef.current = false;
    checkingRef.current = false;
    flippedRef.current = [];
    setFlipped([]);
    setChecking(false);
    setPreviewing(false);
    setHinting([]);
    setBlackout(false);
    playRest();
    persist({
      ...saveRef.current,
      stats: {
        ...saveRef.current.stats,
        restCount: saveRef.current.stats.restCount + 1,
      },
    });
    setScreen("rest");
  }
  function loseLife() {
    if (calmRef.current) return true;
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
  function startCountdown(seconds, session) {
    if (countdownTimerRef.current)
      window.clearInterval(countdownTimerRef.current);
    timeLeftRef.current = seconds;
    setTimeLeft(seconds);
    countdownTimerRef.current = window.setInterval(() => {
      if (sessionRef.current !== session) {
        if (countdownTimerRef.current)
          window.clearInterval(countdownTimerRef.current);
        return;
      }
      const next = Math.max(0, (timeLeftRef.current ?? seconds) - 1);
      timeLeftRef.current = next;
      setTimeLeft(next);
      if (next <= 0) {
        if (countdownTimerRef.current)
          window.clearInterval(countdownTimerRef.current);
        if (calmRef.current) return;
        if (config.v2 && livesRef.current !== null) {
          const survived = loseLife();
          if (!survived) return;
          timeLeftRef.current = config.time;
          setTimeLeft(config.time);
          startCountdown(config.time ?? 40, session);
          return;
        }
        loseGame();
      }
    }, 1000);
  }
  function beginRound(levelNumber, deck, daily, bypassLock) {
    if (!daily) {
      if (levelNumber < 1 || levelNumber > MAX_LEVEL) return;
      if (!bypassLock && levelNumber > unlockedRef.current) return;
    }
    clearTimers();
    sessionRef.current += 1;
    const session = sessionRef.current;
    const levelConfig = daily
      ? getDailyConfig(seedFromKey(todayKey()))
      : getLevelConfig(levelNumber);
    activeRef.current = true;
    checkingRef.current = false;
    flippedRef.current = deck.map((c) => c.id);
    matchedRef.current = new Set();
    livesRef.current = calmRef.current ? null : levelConfig.lives;
    comboRef.current = 0;
    hintsRef.current = levelConfig.hints;
    movesRef.current = 0;
    scoreRef.current = 0;
    cardsRef.current = deck;
    isDailyRef.current = daily;
    levelRef.current = levelNumber;
    setIsDaily(daily);
    setLevel(levelNumber);
    setCards(deck);
    cardsRef.current = deck;
    setFlipped(flippedRef.current);
    setMatched(new Set());
    setTrapped([]);
    setMoves(0);
    setScore(0);
    setCombo(0);
    setLives(calmRef.current ? null : levelConfig.lives);
    setHints(levelConfig.hints);
    setHinting([]);
    setBlackout(false);
    setChecking(false);
    setPreviewing(true);
    setHiddenMessage("");
    setTimeLeft(levelConfig.time);
    timeLeftRef.current = levelConfig.time;
    setOverlay("none");
    setScreen("game");
    previewTimerRef.current = window.setTimeout(() => {
      if (sessionRef.current !== session) return;
      flippedRef.current = [];
      setFlipped([]);
      setPreviewing(false);
      if (levelConfig.time !== null) {
        startCountdown(levelConfig.time, session);
      }
    }, levelConfig.previewTime);
  }
  function startLevel(levelNumber, bypassLock = false) {
    beginRound(levelNumber, createDeck(levelNumber), false, bypassLock);
  }
  function startDaily() {
    const key = todayKey();
    beginRound(0, createDailyDeck(key), true, true);
  }
  function useHint() {
    if (hintsRef.current === null || hintsRef.current <= 0) return;
    if (previewing || checking || blackout || !activeRef.current) return;
    const available = cardsRef.current.filter(
      (card) => !matchedRef.current.has(card.id) && !card.trap,
    );
    const groups = new Map();
    available.forEach((card) => {
      if (card.pairId === null) return;
      const list = groups.get(card.pairId) ?? [];
      list.push(card);
      groups.set(card.pairId, list);
    });
    const pairs = Array.from(groups.values()).filter((p) => p.length === 2);
    if (!pairs.length) return;
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const ids = pair.map((c) => c.id);
    const nextHints = hintsRef.current - 1;
    hintsRef.current = nextHints;
    setHints(nextHints);
    scoreRef.current = Math.max(0, scoreRef.current - 40);
    setScore(scoreRef.current);
    setHinting(ids);
    playHint();
    persist({
      ...saveRef.current,
      stats: {
        ...saveRef.current.stats,
        hintsUsed: saveRef.current.stats.hintsUsed + 1,
      },
    });
    const session = sessionRef.current;
    if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
    hintTimerRef.current = window.setTimeout(() => {
      if (sessionRef.current === session) setHinting([]);
    }, 1200);
  }
  function calculateMatchScore(firstCard, nextCombo) {
    let points = 100 + nextCombo * 25;
    if (levelRef.current >= 41) points += Math.floor(levelRef.current / 20);
    if (firstCard.special === "bloom") points += 150;
    if (firstCard.special === "dew") points += 50;
    if (firstCard.special === "storm") points -= 60;
    return Math.max(25, points);
  }
  function applySpecialCard(card) {
    if (card.special === "dew" && timeLeftRef.current !== null) {
      const nextTime = timeLeftRef.current + config.dewBonus;
      timeLeftRef.current = nextTime;
      setTimeLeft(nextTime);
    }
    if (card.special === "storm") {
      if (timeLeftRef.current !== null) {
        const nextTime = Math.max(0, timeLeftRef.current - 3);
        timeLeftRef.current = nextTime;
        setTimeLeft(nextTime);
      }
      comboRef.current = 0;
      setCombo(0);
    }
  }
  function handleCardClick(cardId) {
    if (!activeRef.current || previewing || checking || blackout) return;
    if (hinting.includes(cardId)) return;
    if (flippedRef.current.includes(cardId)) return;
    if (matchedRef.current.has(cardId)) return;
    if (flippedRef.current.length >= 2) return;
    const clickedCard = cardsRef.current.find((c) => c.id === cardId);
    if (!clickedCard) return;
    playFlip();
    if (clickedCard.trap) {
      flippedRef.current = [...flippedRef.current, cardId];
      setFlipped(flippedRef.current);
      checkingRef.current = true;
      setChecking(true);
      movesRef.current += 1;
      setMoves(movesRef.current);
      const session = sessionRef.current;
      setTrapped((prev) => [...prev, cardId]);
      scoreRef.current = Math.max(0, scoreRef.current - 80);
      setScore(scoreRef.current);
      playMiss();
      loseLife();
      mismatchTimerRef.current = window.setTimeout(() => {
        if (sessionRef.current !== session) return;
        flippedRef.current = [];
        setFlipped([]);
        checkingRef.current = false;
        setChecking(false);
        if (config.shuffleEvery) shuffleCurrentBoard();
      }, 700);
      return;
    }
    const nextFlipped = [...flippedRef.current, cardId];
    flippedRef.current = nextFlipped;
    setFlipped(nextFlipped);
    if (nextFlipped.length === 1) return;
    const firstCard = cardsRef.current.find((c) => c.id === nextFlipped[0]);
    const secondCard = cardsRef.current.find((c) => c.id === nextFlipped[1]);
    if (!firstCard || !secondCard) {
      flippedRef.current = [];
      setFlipped([]);
      return;
    }
    checkingRef.current = true;
    setChecking(true);
    movesRef.current += 1;
    const nextMove = movesRef.current;
    setMoves(nextMove);
    const session = sessionRef.current;
    const isMatch = firstCard.pairId === secondCard.pairId;
    if (isMatch) {
      const updated = new Set(matchedRef.current);
      updated.add(firstCard.id);
      updated.add(secondCard.id);
      matchedRef.current = updated;
      setMatched(new Set(updated));
      const nextCombo = config.v2 ? comboRef.current + 1 : 0;
      comboRef.current = nextCombo;
      setCombo(nextCombo);
      const points = calculateMatchScore(firstCard, nextCombo);
      scoreRef.current += points;
      setScore(scoreRef.current);
      playMatch();
      if (navigator.vibrate) navigator.vibrate(12);
      const collection = new Set(saveRef.current.collection);
      collection.add(firstCard.motifId);
      persist({
        ...saveRef.current,
        collection: Array.from(collection),
        stats: {
          ...saveRef.current.stats,
          totalMatches: saveRef.current.stats.totalMatches + 1,
          bestCombo: Math.max(saveRef.current.stats.bestCombo, nextCombo),
        },
      });
      applySpecialCard(firstCard);
      if (config.blackoutEvery && nextMove % config.blackoutEvery === 0) {
        window.setTimeout(triggerBlackout, 280);
      }
      mismatchTimerRef.current = window.setTimeout(() => {
        if (sessionRef.current !== session) return;
        const matchedPairs = updated.size / 2;
        if (matchedPairs >= config.pairs) {
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
    playMiss();
    mismatchTimerRef.current = window.setTimeout(() => {
      if (sessionRef.current !== session) return;
      if (config.v2) {
        const survived = loseLife();
        if (!survived) return;
      }
      if (config.wrongTimePenalty > 0 && timeLeftRef.current !== null) {
        const nextTime = Math.max(
          0,
          timeLeftRef.current - config.wrongTimePenalty,
        );
        timeLeftRef.current = nextTime;
        setTimeLeft(nextTime);
        if (nextTime <= 0 && !calmRef.current) {
          loseGame();
          return;
        }
      }
      flippedRef.current = [];
      setFlipped([]);
      checkingRef.current = false;
      setChecking(false);
      comboRef.current = 0;
      setCombo(0);
      if (config.shuffleEvery && nextMove % config.shuffleEvery === 0) {
        shuffleCurrentBoard();
      }
      if (config.blackoutEvery && nextMove % config.blackoutEvery === 0) {
        triggerBlackout();
      }
    }, 620);
  }
  function completeLevel(session) {
    if (sessionRef.current !== session || !activeRef.current) return;
    activeRef.current = false;
    checkingRef.current = false;
    if (countdownTimerRef.current)
      window.clearInterval(countdownTimerRef.current);
    if (mismatchTimerRef.current) window.clearTimeout(mismatchTimerRef.current);
    setChecking(false);
    setBlackout(false);
    playWin();
    const current = saveRef.current;
    const perfect = movesRef.current <= config.pairs;
    const nextCompleted = new Set(current.completed);
    if (!isDailyRef.current) nextCompleted.add(levelRef.current);
    let highest = current.highestUnlocked;
    if (!isDailyRef.current && levelRef.current < MAX_LEVEL) {
      highest = Math.max(highest, levelRef.current + 1);
    }
    unlockedRef.current = highest;
    const key = todayKey();
    let dailyStreak = current.dailyStreak;
    let lastDaily = current.lastDaily;
    let dailies = current.stats.dailies;
    if (isDailyRef.current && current.lastDaily !== key) {
      dailies += 1;
      lastDaily = key;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dailyStreak =
        current.lastDaily === todayKey(yesterday) ? dailyStreak + 1 : 1;
    }
    persist({
      ...current,
      highestUnlocked: highest,
      completed: Array.from(nextCompleted).sort((a, b) => a - b),
      lastDaily,
      dailyStreak,
      lastPlayDate: key,
      stats: {
        ...current.stats,
        totalScore: current.stats.totalScore + scoreRef.current,
        perfectLevels: current.stats.perfectLevels + (perfect ? 1 : 0),
        dailies,
        longestStreak: Math.max(current.stats.longestStreak, dailyStreak),
      },
    });
    setHiddenMessage(
      isDailyRef.current ? getDailyNote() : getLevelNote(levelRef.current),
    );
    completeTimerRef.current = window.setTimeout(() => {
      if (sessionRef.current === session) setScreen("complete");
    }, 420);
  }
  function goToNextLevel() {
    if (isDailyRef.current) {
      setScreen("map");
      return;
    }
    if (travelLockRef.current || levelRef.current >= MAX_LEVEL) return;
    const nextLevel = levelRef.current + 1;
    if (nextLevel > unlockedRef.current) return;
    travelLockRef.current = true;
    setTraveling(true);
    const session = sessionRef.current;
    travelTimerRef.current = window.setTimeout(() => {
      if (sessionRef.current !== session) {
        travelLockRef.current = false;
        setTraveling(false);
        return;
      }
      travelLockRef.current = false;
      setTraveling(false);
      startLevel(nextLevel, true);
    }, 900);
  }
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
    setIsDaily(false);
    isDailyRef.current = false;
    setOverlay("none");
    setScreen("map");
  }
  function enterGarden() {
    setScreen("map");
  }
  function restartLevel() {
    if (isDailyRef.current) startDaily();
    else startLevel(levelRef.current, true);
  }
  function markTalkedToIris() {
    persist({
      ...saveRef.current,
      stats: {
        ...saveRef.current.stats,
        talkedToIris: saveRef.current.stats.talkedToIris + 1,
      },
    });
  }
  const currentGarden =
    GARDENS.find(
      (g) => save.highestUnlocked >= g.from && save.highestUnlocked <= g.to,
    ) ?? GARDENS[0];
  return {
    hydrated,
    save,
    screen,
    overlay,
    setOverlay,
    setScreen,
    level,
    isDaily,
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
    currentGarden,
    startLevel,
    startDaily,
    handleCardClick,
    useHint,
    goToNextLevel,
    backToMap,
    enterGarden,
    restartLevel,
    patchSettings,
    setName,
    replaceSave,
    markTalkedToIris,
  };
}
