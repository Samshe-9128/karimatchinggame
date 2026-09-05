import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const musicFiles = import.meta.glob(
  "./assets/music/*.{mp3,MP3,ogg,OGG,wav,WAV,m4a,M4A}",
  { eager: true, query: "?url", import: "default" },
);

const MUSIC_TRACKS = Object.values(musicFiles);

const EMOJIS = [
  "🌸",
  "🐼",
  "💗",
  "🌙",
  "✨",
  "🦋",
  "🌷",
  "🍓",
  "🍒",
  "🧸",
  "🎀",
  "🌻",
  "🍩",
  "🎮",
  "🎧",
  "⭐",
  "🍉",
  "🦊",
  "🐰",
  "🐱",
  "☁️",
  "🍀",
  "🌈",
  "💫",
  "🫶",
  "🌺",
  "🍰",
  "🪻",
  "🕊️",
  "🥨",
];

const KARI_MESSAGES = [
  "Okay Kari... not bad 😂",
  "See? I knew you had it in you 😌",
  "Don't get too proud, it was only one level 👀",
  "Go drink some water before I start lecturing you 😂",
  "Okayyy miss genius, calm down 😭",
  "I'm not saying you're cute when you're focused... but 👀",
  "One level down. Still stuck with Sam unfortunately.",
  "You actually did that pretty fast... suspicious 🤨",
  "Remember to take care of yourself too, okay? 🌸",
  "I could've made this easier. But annoying you is half the fun 😂",
  "Imagine losing to emojis... embarrassing. Good thing you're not me 😭",
  "Not gonna lie, I'm kinda enjoying watching you play this 😌",
  "Okay fine, that was impressive.",
  "You better not skip the message just because you wanna see the next level 😂",
  "Tiny reminder: eat something if you haven't already.",
  "You're getting dangerously good at this 👀",
  "I hope something made you smile today. If not, this message will have to do 😂",
  "I made this game just so I could keep bothering you.",
  "Don't let this game distract you from sleeping properly, nerd 🌙",
  "Another win... Sam is pretending to be surprised.",
  "If I give you a hint, I deserve credit for the win too. Fair? 😌",
  "You're cute. Anyway... next level 😂",
  "I was gonna say something sweet but then I remembered you're annoying.",
  "Okay, I'm actually proud of you. Don't make me repeat it.",
  "You're really committed to beating all 100 huh 😭",
  "Drink water. Yes, I'm still doing my annoying Sam duties.",
  "This level was supposed to humble you 😂",
  "Apparently you're smarter than I gave you credit for.",
  "I wonder if you're reading every single one of these 👀",
  "Don't answer that. I already know you are 😂",
  "At this point I'm just making excuses to talk to you.",
  "One more level... because clearly I wasn't done annoying you.",
  "You know what's unfair? You somehow make this look easy.",
  "If I were there, I'd probably distract you instead of helping 😌",
  "Okay okay... you're pretty good at this.",
  "Your reward is another message from me. You're welcome.",
  "Please don't let this game inflate your ego 😂",
  "I hope you're having a good day, Kari. 🌸",
  "Another one down. Come here, I'll give you an imaginary high five ✋",
  "I'm starting to think your stubbornness is carrying you through this.",
  "You really chose to spend your time finding tiny emojis for me 😭",
  "That's actually kinda cute.",
  "No cheating. I know where you live... spiritually 👀😂",
  "You're allowed to take a break, you know.",
  "Okay, that was smooth. I'll give you that.",
  "I made 100 levels because apparently one excuse to bother you wasn't enough.",
  "Don't stay up too late trying to finish this 😌",
  "You're doing better than you think.",
  "If you lose now, I'll laugh. If you win, I'll still laugh. Perfect system 😂",
  "Halfway there... and I'm still not tired of talking to you.",
  "Okay fine... maybe I like making little things for you.",
  "Don't expose me though 😭",
  "You know I actually put way too much thought into this, right?",
  "Another level unlocked. Another excuse to tell you you're cute 👀",
  "I'm beginning to regret making this game this long 😂",
  "No I'm not. I like having you here.",
  "Go stretch a little. Your screen isn't going anywhere.",
  "You survived another one. Proud of you, idiot 😌",
  "I hope you're taking care of yourself while you're busy with everything else.",
  "You're becoming way too good at my own game.",
  "At this point you're basically speedrunning my affection 😂",
  "Okay that was smooth... almost as smooth as me. Almost.",
  "I feel like you secretly enjoy getting these messages.",
  "Another win for you. My ego is taking damage 😭",
  "I could've just sent you a normal message, but apparently I had to build an entire game 😂",
  "You're one of my favorite people to annoy. Just so we're clear.",
  "Don't smile too much. I might start thinking I'm funny.",
  "You know I really like seeing you happy, right?",
  "Tiny reminder that you're appreciated. That's all. 🌸",
  "Okay enough sweetness. Go beat the next level 😂",
  "I wonder what you're gonna say when you realize how many messages I wrote for you.",
  "You're still here. I'm still here. This is getting suspicious 👀",
  "If this game takes you 3 hours, I'm blaming your memory 😂",
  "You're cute when you're competitive. It's a problem.",
  "I hope you know there's a lot of care hiding behind all my teasing.",
  "Another one done. I'm genuinely happy you're enjoying this.",
  "Don't make me say something embarrassingly sweet 😭",
  "Fine... I'm glad you're here.",
  "You really are special to me, you know.",
  "Okay that's enough feelings for one level. Back to bullying you 😂",
  "Only a few more... don't disappear now 👀",
  "You're actually going to finish all 100, aren't you?",
  "I made this for you and somehow you're the one making me nervous now 😂",
  "Three more after this... behave yourself.",
  "You're getting dangerously close to the final message.",
  "I hope you've been smiling at at least some of these.",
  "One more little level. You've got this 🌸",
  "Okay Kari... I'm officially impressed.",
  "Last one after this. Don't make me emotional 😭",
  "Haha... you actually finished it 😂💗",
  "I hope you know I really did make every little part of this thinking about you.",
  "And yes, I'd probably do something this stupid for you again 😂",
  "You made it all the way here... I'm genuinely happy you did.",
  "Okay, final level. Come on, pretty girl 😌",
  "You better appreciate how much work went into this, because I'm never admitting how long it took 😂",
  "I think my favorite part was knowing you'd eventually find all these messages.",
  "Thanks for playing along with my stupid little idea. 🌸",
  "You survived 100 levels of me. Honestly, that deserves a medal 😂",
  "And somehow, after all that... I'd still choose you to annoy.",
  "Haha... you finally finished it 😭💗 I'm really glad you played it all the way through. I made this whole ridiculous thing just for you, and honestly? I'd do it again.",
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors.
  }
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getLevelConfig(level) {
  const pairs = Math.min(20, 3 + Math.floor((level - 1) / 6));

  /*
    The timer is matched to the number of pairs.

    1-5     : unlimited
    6-20    : 75s
    21-30   : 70s
    31-40   : 65s
    41-60   : 60s
    61-80   : 55s
    81-100  : 50s
  */
  let time = null;

  if (level >= 6) time = 75;
  if (level >= 21) time = 70;
  if (level >= 31) time = 65;
  if (level >= 41) time = 60;
  if (level >= 61) time = 55;
  if (level >= 81) time = 50;

  let previewTime = 1200;

  if (level >= 31) previewTime = 1100;
  if (level >= 61) previewTime = 1000;
  if (level >= 81) previewTime = 900;

  return { pairs, time, previewTime };
}

function getDifficulty(level) {
  if (level >= 81) return "Insane";
  if (level >= 61) return "Expert";
  if (level >= 41) return "Hard";
  if (level >= 21) return "Medium";
  return "Easy";
}

export default function App() {
  const [highestUnlocked, setHighestUnlocked] = useState(() => {
    const saved = Number(readStorage("kari-memory-highest-level", "1"));
    return Math.min(100, Math.max(1, Math.floor(saved)));
  });

  const [completedLevels, setCompletedLevels] = useState(() => {
    try {
      const saved = JSON.parse(
        readStorage("kari-memory-completed-levels", "[]"),
      );

      return new Set(
        Array.isArray(saved)
          ? saved.filter(
              (value) => Number.isInteger(value) && value >= 1 && value <= 100,
            )
          : [],
      );
    } catch {
      return new Set();
    }
  });

  const [screen, setScreen] = useState("map");
  const [level, setLevel] = useState(() => {
    const saved = Number(readStorage("kari-memory-highest-level", "1"));
    return Math.min(100, Math.max(1, Math.floor(saved)));
  });

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());

  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [previewing, setPreviewing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hiddenMessage, setHiddenMessage] = useState("");
  const [traveling, setTraveling] = useState(false);

  const [musicOn, setMusicOn] = useState(() => {
    return readStorage("kari-memory-music", "on") !== "off";
  });

  const audioRef = useRef(null);
  const musicOnRef = useRef(musicOn);
  const currentTrackRef = useRef(null);

  const flippedRef = useRef([]);
  const matchedRef = useRef(new Set());
  const checkingRef = useRef(false);
  const activeRef = useRef(false);
  const timeLeftRef = useRef(null);
  const unlockedRef = useRef(highestUnlocked);
  const travelLockRef = useRef(false);
  const sessionRef = useRef(0);

  const previewTimerRef = useRef(null);
  const mismatchTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const completeTimerRef = useRef(null);
  const travelTimerRef = useRef(null);

  const config = useMemo(() => getLevelConfig(level), [level]);

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
    musicOnRef.current = musicOn;
    writeStorage("kari-memory-music", musicOn ? "on" : "off");

    if (!audioRef.current) return;

    if (musicOn) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);

  function clearTimers() {
    clearTimeout(previewTimerRef.current);
    clearTimeout(mismatchTimerRef.current);
    clearTimeout(completeTimerRef.current);
    clearTimeout(travelTimerRef.current);
    clearInterval(countdownTimerRef.current);
  }

  /* ==========================================================
     MUSIC
  ========================================================== */

  useEffect(() => {
    if (MUSIC_TRACKS.length === 0) return undefined;

    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 0.3;
    audioRef.current = audio;

    function chooseTrack() {
      if (MUSIC_TRACKS.length === 1) {
        return MUSIC_TRACKS[0];
      }

      const available = MUSIC_TRACKS.filter(
        (track) => track !== currentTrackRef.current,
      );

      return available[Math.floor(Math.random() * available.length)];
    }

    function playNextTrack() {
      const nextTrack = chooseTrack();

      currentTrackRef.current = nextTrack;
      audio.src = nextTrack;

      if (musicOnRef.current) {
        audio.play().catch(() => {});
      }
    }

    audio.addEventListener("ended", playNextTrack);
    playNextTrack();

    return () => {
      audio.removeEventListener("ended", playNextTrack);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    function unlockAudio() {
      if (!musicOnRef.current || !audioRef.current) return;
      audioRef.current.play().catch(() => {});
    }

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      activeRef.current = false;
    };
  }, []);

  /* ==========================================================
     DECK
  ========================================================== */

  function createDeck(levelNumber) {
    const { pairs } = getLevelConfig(levelNumber);
    const emojis = shuffle(EMOJIS).slice(0, pairs);
    const deck = [];

    emojis.forEach((emoji, pairId) => {
      deck.push({
        id: `${levelNumber}-${pairId}-a-${Math.random()}`,
        pairId,
        emoji,
      });

      deck.push({
        id: `${levelNumber}-${pairId}-b-${Math.random()}`,
        pairId,
        emoji,
      });
    });

    return shuffle(deck);
  }

  /* ==========================================================
     TIMER
  ========================================================== */

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

      if (next === 0) {
        clearInterval(countdownTimerRef.current);
        clearTimeout(mismatchTimerRef.current);

        sessionRef.current += 1;
        activeRef.current = false;
        checkingRef.current = false;
        flippedRef.current = [];

        setFlipped([]);
        setChecking(false);
        setPreviewing(false);
        setScreen("lost");
      }
    }, 1000);
  }

  /* ==========================================================
     START LEVEL
  ========================================================== */

  function startLevel(levelNumber, bypassLock = false) {
    if (levelNumber < 1 || levelNumber > 100) return;

    if (!bypassLock && levelNumber > unlockedRef.current) {
      return;
    }

    clearTimers();
    sessionRef.current += 1;

    const session = sessionRef.current;
    const levelConfig = getLevelConfig(levelNumber);
    const deck = createDeck(levelNumber);

    activeRef.current = true;
    checkingRef.current = false;
    flippedRef.current = deck.map((card) => card.id);
    matchedRef.current = new Set();

    setLevel(levelNumber);
    setCards(deck);
    setFlipped(flippedRef.current);
    setMatched(new Set());
    setMoves(0);
    setScore(0);
    setChecking(false);
    setPreviewing(true);
    setHiddenMessage("");
    setTimeLeft(levelConfig.time);
    timeLeftRef.current = levelConfig.time;
    setScreen("game");

    if (musicOnRef.current && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

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

  /* ==========================================================
     CARD CLICK
  ========================================================== */

  function handleCardClick(cardId) {
    if (!activeRef.current) return;
    if (previewing) return;
    if (checkingRef.current) return;
    if (flippedRef.current.includes(cardId)) return;
    if (matchedRef.current.has(cardId)) return;
    if (flippedRef.current.length >= 2) return;

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
    setMoves((value) => value + 1);

    const session = sessionRef.current;
    const isMatch = firstCard.pairId === secondCard.pairId;

    if (isMatch) {
      const updatedMatched = new Set(matchedRef.current);

      updatedMatched.add(firstId);
      updatedMatched.add(secondId);

      matchedRef.current = updatedMatched;
      setMatched(new Set(updatedMatched));
      setFlipped(nextFlipped);
      setScore((value) => value + 100);

      mismatchTimerRef.current = setTimeout(() => {
        if (sessionRef.current !== session) return;

        const finished = updatedMatched.size === cards.length;

        if (finished) {
          completeLevel(session);
          return;
        }

        flippedRef.current = [];
        setFlipped([]);
        checkingRef.current = false;
        setChecking(false);
      }, 280);

      return;
    }

    mismatchTimerRef.current = setTimeout(() => {
      if (sessionRef.current !== session) return;

      flippedRef.current = [];
      setFlipped([]);
      checkingRef.current = false;
      setChecking(false);
    }, 650);
  }

  /* ==========================================================
     COMPLETE
  ========================================================== */

  function completeLevel(session) {
    if (sessionRef.current !== session) return;
    if (!activeRef.current) return;

    activeRef.current = false;
    checkingRef.current = false;

    clearInterval(countdownTimerRef.current);
    clearTimeout(mismatchTimerRef.current);

    setChecking(false);

    setCompletedLevels((previous) => {
      const updated = new Set(previous);
      updated.add(level);
      return updated;
    });

    if (level < 100) {
      setHighestUnlocked((previous) => {
        const next = Math.max(previous, level + 1);

        unlockedRef.current = next;
        return next;
      });
    }

    setHiddenMessage(
      KARI_MESSAGES[Math.min(level - 1, KARI_MESSAGES.length - 1)],
    );

    completeTimerRef.current = setTimeout(() => {
      if (sessionRef.current !== session) return;
      setScreen("complete");
    }, 450);
  }

  /* ==========================================================
     NEXT LEVEL
  ========================================================== */

  function goToNextLevel() {
    if (travelLockRef.current) return;
    if (level >= 100) return;

    const nextLevel = level + 1;

    if (nextLevel > unlockedRef.current) {
      return;
    }

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

  /* ==========================================================
     MAP
  ========================================================== */

  function backToMap() {
    clearTimers();
    sessionRef.current += 1;

    activeRef.current = false;
    checkingRef.current = false;
    travelLockRef.current = false;

    flippedRef.current = [];
    matchedRef.current = new Set();

    setTraveling(false);
    setPreviewing(false);
    setChecking(false);
    setFlipped([]);
    setMatched(new Set());
    setTimeLeft(null);
    timeLeftRef.current = null;
    setScreen("map");
  }

  const musicButton =
    MUSIC_TRACKS.length > 0 ? (
      <button
        className={`music-control ${musicOn ? "music-on" : "music-off"}`}
        onClick={() => setMusicOn((value) => !value)}
        aria-label={musicOn ? "Turn music off" : "Turn music on"}
      >
        <span className="music-symbol">{musicOn ? "♫" : "×"}</span>
        {musicOn ? "Music on" : "Music off"}
      </button>
    ) : null;

  /* ==========================================================
     MAP SCREEN
  ========================================================== */

  if (screen === "map") {
    return (
      <div className="app">
        {musicButton}

        <main className="map-screen">
          <header className="map-header">
            <div>
              <p className="eyebrow">KARI × SAM</p>
              <h1>Memory Road</h1>
              <p className="map-subtitle">One little level at a time 🌸</p>
            </div>

            <div className="map-counter">
              <strong>{completedLevels.size}</strong>
              <span>/100</span>
              <small>completed</small>
            </div>
          </header>

          <section className="continue-card">
            <div>
              <span>NEXT STOP</span>
              <strong>Level {highestUnlocked}</strong>
              <small>
                {highestUnlocked === 1
                  ? "Your first little challenge."
                  : highestUnlocked === 100
                    ? "The final level is waiting."
                    : "Continue where you left off."}
              </small>
            </div>

            <button onClick={() => startLevel(highestUnlocked)}>
              Continue →
            </button>
          </section>

          <section className="road-wrapper">
            <div className="road">
              <div className="road-center" />

              {Array.from({ length: 100 }, (_, index) => {
                const levelNumber = index + 1;
                const unlocked = levelNumber <= highestUnlocked;
                const completed = completedLevels.has(levelNumber);
                const current = levelNumber === highestUnlocked && !completed;
                const side = levelNumber % 2 === 0 ? "right" : "left";

                return (
                  <div
                    key={levelNumber}
                    data-level={levelNumber}
                    className={`road-level ${side} ${
                      unlocked ? "unlocked" : "locked"
                    } ${completed ? "completed" : ""} ${
                      current ? "current" : ""
                    }`}
                  >
                    <span className="road-connector" />

                    <button
                      className="level-node"
                      disabled={!unlocked}
                      onClick={() => startLevel(levelNumber)}
                    >
                      {completed ? "✓" : unlocked ? levelNumber : "🔒"}
                    </button>

                    <div className="road-label">
                      <strong>Level {levelNumber}</strong>
                      <small>
                        {completed
                          ? "completed"
                          : current
                            ? "next stop"
                            : unlocked
                              ? "play again"
                              : "locked"}
                      </small>
                    </div>

                    {current && <span className="map-van">🚐</span>}
                  </div>
                );
              })}
            </div>
          </section>

          <footer className="map-footer">Old levels stay unlocked 🌸</footer>
        </main>
      </div>
    );
  }

  /* ==========================================================
     GAME SCREEN
  ========================================================== */

  if (screen === "game") {
    const progress = cards.length ? (matched.size / cards.length) * 100 : 0;

    let columns = 4;
    if (config.pairs >= 9) columns = 6;
    if (config.pairs >= 13) columns = 8;

    const rows = Math.ceil(cards.length / columns);

    return (
      <div className="app">
        {musicButton}

        <main className="game-screen">
          <header className="game-header">
            <button className="back-button" onClick={backToMap}>
              ← Map
            </button>

            <div className="current-level">
              <span>LEVEL</span>
              <strong>{level}</strong>
            </div>

            <div className="game-stats">
              <div>
                <small>MOVES</small>
                <strong>{moves}</strong>
              </div>

              <div>
                <small>SCORE</small>
                <strong>{score}</strong>
              </div>

              {timeLeft !== null && (
                <div>
                  <small>TIME</small>
                  <strong className={timeLeft <= 10 ? "danger" : ""}>
                    {timeLeft}s
                  </strong>
                </div>
              )}
            </div>
          </header>

          <section className="game-heading">
            <p className="eyebrow">{getDifficulty(level)}</p>

            <h1>Find the pairs</h1>

            <p>
              {previewing
                ? "Remember them... 👀"
                : checking
                  ? "Checking... 😂"
                  : "Let's see how good that memory is."}
            </p>
          </section>

          <div className="progress-bar">
            <div
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <section className="game-board-area">
            <div
              className="memory-board"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              }}
            >
              {cards.map((card) => {
                const visible =
                  flipped.includes(card.id) || matched.has(card.id);

                const isMatched = matched.has(card.id);

                return (
                  <button
                    key={card.id}
                    className={`memory-card ${visible ? "flipped" : ""} ${
                      isMatched ? "matched" : ""
                    }`}
                    disabled={previewing || checking || visible}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <span className="card-inner">
                      <span className="card-face card-front">{card.emoji}</span>

                      <span className="card-face card-back">✦</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {previewing && (
              <div className="preview-label">Remember everything... 👀</div>
            )}
          </section>

          <footer className="game-footer">
            <span>Made for Kari 🌸</span>
            <span>
              {matched.size / 2} / {config.pairs}
            </span>
          </footer>
        </main>
      </div>
    );
  }

  /* ==========================================================
     COMPLETE SCREEN
  ========================================================== */

  if (screen === "complete") {
    const nextLevel = level < 100 ? level + 1 : null;

    return (
      <div className="app">
        {musicButton}

        <main className="result-page">
          <div className="result-card">
            <div className="result-icon">🌸</div>

            <p className="eyebrow">LEVEL {level} COMPLETE</p>

            <h1>Okay Kari... you did it 😂</h1>

            <p className="result-message">{hiddenMessage}</p>

            <div className="result-stats">
              <div>
                <small>MOVES</small>
                <strong>{moves}</strong>
              </div>

              <div>
                <small>SCORE</small>
                <strong>{score}</strong>
              </div>
            </div>

            {nextLevel ? (
              <>
                <div className="next-road">
                  <span>✓</span>

                  <div className="mini-road">
                    <div className={`mini-van ${traveling ? "moving" : ""}`}>
                      🚐
                    </div>
                  </div>

                  <span>{nextLevel}</span>
                </div>

                <p className="next-text">
                  {traveling
                    ? `Taking you to Level ${nextLevel}...`
                    : `Level ${nextLevel} is unlocked.`}
                </p>

                <button
                  className="primary-button"
                  disabled={traveling}
                  onClick={goToNextLevel}
                >
                  {traveling
                    ? "On the way..."
                    : `Ride to Level ${nextLevel} 🚐`}
                </button>

                <button className="secondary-button" onClick={backToMap}>
                  Back to road
                </button>
              </>
            ) : (
              <>
                <p className="final-note">
                  Haha... you actually finished all 100 levels 😭💗
                </p>

                <button className="secondary-button" onClick={backToMap}>
                  Back to road
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  /* ==========================================================
     LOST SCREEN
  ========================================================== */

  return (
    <div className="app">
      {musicButton}

      <main className="result-page">
        <div className="result-card">
          <div className="result-icon">😭</div>

          <p className="eyebrow">LEVEL {level}</p>

          <h1>Okayyy... you got me 😂</h1>

          <p className="result-message">
            Time ran out before you could finish.
            <br />
            Sam isn't judging. Much. 👀
          </p>

          <button className="primary-button" onClick={() => startLevel(level)}>
            Try again
          </button>

          <button className="secondary-button" onClick={backToMap}>
            Back to road
          </button>
        </div>
      </main>
    </div>
  );
}
