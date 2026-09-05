import { useState } from "react";

import { MAX_LEVEL, getVersion } from "../utils/gameConfig";

export default function MapScreen({
  highestUnlocked,
  completedLevels,
  onStartLevel,
  onStats,
}) {
  const [jumpLevel, setJumpLevel] = useState("");

  function handleJump() {
    const value = Number(jumpLevel);

    if (!Number.isInteger(value) || value < 1 || value > highestUnlocked) {
      return;
    }

    onStartLevel(value);
    setJumpLevel("");
  }

  const currentVersion = getVersion(highestUnlocked);

  return (
    <main className="map-screen">
      <header className="map-header">
        <div>
          <p className="eyebrow">KARI × SAM</p>

          <h1>Memory Road</h1>

          <p className="map-subtitle">
            {currentVersion.emoji} {currentVersion.name}
          </p>
        </div>

        <div className="map-counter">
          <strong>{completedLevels.size}</strong>

          <span>/{MAX_LEVEL}</span>

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
              : highestUnlocked >= 4501
                ? "The final dream is waiting. 💗"
                : highestUnlocked >= 101
                  ? `V${currentVersion.id}: ${currentVersion.name}`
                  : "Continue where you left off."}
          </small>
        </div>

        <button onClick={() => onStartLevel(highestUnlocked)}>
          Continue →
        </button>
      </section>

      <div className="map-tools">
        <div className="level-jump">
          <input
            type="number"
            min="1"
            max={highestUnlocked}
            placeholder="Level..."
            value={jumpLevel}
            onChange={(event) => setJumpLevel(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleJump();
              }
            }}
          />

          <button onClick={handleJump}>Go</button>
        </div>

        <button className="stats-button" onClick={onStats}>
          📊 Stats
        </button>
      </div>

      {highestUnlocked >= 101 && (
        <div className="v2-banner">
          {currentVersion.emoji} VERSION {currentVersion.id} ·{" "}
          {currentVersion.name} · LEVEL {currentVersion.min}–
          {currentVersion.max}
        </div>
      )}

      <section className="road-wrapper">
        <div className="road">
          <div className="road-center" />

          {Array.from(
            {
              length: MAX_LEVEL,
            },
            (_, index) => {
              const levelNumber = index + 1;

              const unlocked = levelNumber <= highestUnlocked;

              const completed = completedLevels.has(levelNumber);

              const current = levelNumber === highestUnlocked && !completed;

              const side = levelNumber % 2 === 0 ? "right" : "left";

              const version = getVersion(levelNumber);

              const isChapterStart = levelNumber === version.min;

              const isBoss = levelNumber >= 4001 && levelNumber % 50 === 0;

              return (
                <div
                  key={levelNumber}
                  className={`
                    road-level
                    ${side}
                    ${unlocked ? "unlocked" : "locked"}
                    ${completed ? "completed" : ""}
                    ${current ? "current" : ""}
                    ${isChapterStart ? "chapter-start" : ""}
                  `}
                  data-level={levelNumber}
                >
                  {isChapterStart && (
                    <div className="chapter-label">
                      {version.emoji} V{version.id} · {version.name}
                    </div>
                  )}

                  <span className="road-connector" />

                  <button
                    className={`level-node ${isBoss ? "boss-node" : ""}`}
                    disabled={!unlocked}
                    onClick={() => onStartLevel(levelNumber)}
                  >
                    {completed
                      ? "✓"
                      : isBoss
                        ? "👑"
                        : unlocked
                          ? levelNumber
                          : "🔒"}
                  </button>

                  <div className="road-label">
                    <strong>Level {levelNumber}</strong>

                    <small>
                      {isBoss
                        ? "BOSS"
                        : completed
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
            },
          )}
        </div>
      </section>

      <footer className="map-footer">
        {completedLevels.size >= MAX_LEVEL
          ? "You actually conquered Memory Road. 😭💗"
          : `${MAX_LEVEL} levels. One road. Endless chaos. 🌸`}
      </footer>
    </main>
  );
}
