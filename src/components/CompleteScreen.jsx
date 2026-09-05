import { MAX_LEVEL } from "../utils/gameConfig";

export default function CompleteScreen({
  level,
  moves,
  score,
  hiddenMessage,
  traveling,
  combo,
  lives,
  onNext,
  onBack,
}) {
  const final = level === MAX_LEVEL;

  const boss = level >= 4001 && level % 50 === 0;

  const nextLevel = level < MAX_LEVEL ? level + 1 : null;

  return (
    <main className="result-page">
      <div className="result-card">
        <div className="result-icon">
          {final ? "💗" : boss ? "👑" : level >= 101 ? "✨" : "🌸"}
        </div>

        <p className="eyebrow">LEVEL {level} COMPLETE</p>

        <h1>
          {final
            ? "YOU ACTUALLY DID IT 😭"
            : boss
              ? "Boss defeated 👑"
              : "Okay Kari... you did it 😂"}
        </h1>

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

          {level >= 101 && (
            <>
              <div>
                <small>COMBO</small>

                <strong>🔥 x{combo}</strong>
              </div>

              {lives !== null && (
                <div>
                  <small>LIVES</small>

                  <strong>{"❤️".repeat(lives)}</strong>
                </div>
              )}
            </>
          )}
        </div>

        {final ? (
          <>
            <p className="final-note">
              5,000 levels.
              <br />
              Every version.
              <br />
              Every stupid little emoji.
              <br />
              You made it all the way. 😭💗
            </p>

            <button className="secondary-button" onClick={onBack}>
              Back to road
            </button>
          </>
        ) : (
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
              onClick={onNext}
            >
              {traveling ? "On the way..." : `Ride to Level ${nextLevel} 🚐`}
            </button>

            <button className="secondary-button" onClick={onBack}>
              Back to road
            </button>
          </>
        )}
      </div>
    </main>
  );
}
