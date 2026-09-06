import { getVersion } from "../utils/gameConfig";

export default function GameHeader({
  level,
  moves,
  score,
  timeLeft,
  lives,
  combo,
  onBack,
  onRestart,
}) {
  const version = getVersion(level);

  return (
    <header className="game-header">
      <div className="header-left">
        <button className="back-button" onClick={onBack}>
          ← Map
        </button>
        <button
          className="restart-button"
          onClick={onRestart}
          title="Restart level"
        >
          🔄
        </button>
      </div>

      <div className="current-level">
        <span>LEVEL {level}</span>
        <strong>
          {version.emoji} {version.name}
        </strong>
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
        {lives !== null && (
          <div>
            <small>LIVES</small>
            <strong>
              {"❤️".repeat(lives)}
              {"🖤".repeat(Math.max(0, 3 - lives))}
            </strong>
          </div>
        )}
        {combo > 0 && (
          <div>
            <small>COMBO</small>
            <strong>🔥 x{combo}</strong>
          </div>
        )}
      </div>
    </header>
  );
}
