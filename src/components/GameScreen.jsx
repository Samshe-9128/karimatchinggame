import GameHeader from "./GameHeader";
import MemoryBoard from "./MemoryBoard";
import HintButton from "./HintButton";

import {
  getBoardColumns,
  getBoardRows,
  getDifficulty,
} from "../utils/gameConfig";

export default function GameScreen({
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
  config,
  onHint,
  onCardClick,
  onBack,
  onRestart, // ✅ new prop
}) {
  const progress =
    config.pairs > 0 ? (matched.size / 2 / config.pairs) * 100 : 0;

  const columns = getBoardColumns(config.pairs);
  const rows = getBoardRows(cards.length, columns);

  return (
    <main className="game-screen">
      <GameHeader
        level={level}
        moves={moves}
        score={score}
        timeLeft={timeLeft}
        lives={lives}
        combo={combo}
        onBack={onBack}
        onRestart={onRestart} // ✅ pass down
      />

      <section className="game-heading">
        <div className="version-pill">
          {config.version.emoji} V{config.version.id} · {config.version.name}
        </div>

        <p className="eyebrow">{getDifficulty(level)}</p>

        <h1>
          {config.boss
            ? "BOSS LEVEL 👑"
            : config.v2
              ? "Survive the pairs"
              : "Find the pairs"}
        </h1>

        <p>
          {previewing
            ? "Remember them... 👀"
            : checking
              ? "Checking... 😂"
              : config.boss
                ? "This one is supposed to hurt. 😈"
                : config.v2
                  ? "The road keeps changing."
                  : "Let's see how good that memory is."}
        </p>

        {config.v2 && (
          <div className="v2-controls">
            <HintButton
              hints={hints}
              onHint={onHint}
              disabled={previewing || checking || blackout}
            />

            {combo >= 2 && (
              <span className="combo-banner">🔥 {combo}x combo!</span>
            )}
          </div>
        )}
      </section>

      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>

      <section className="game-board-area">
        <MemoryBoard
          cards={cards}
          flipped={flipped}
          matched={matched}
          trapped={trapped}
          hinting={hinting}
          previewing={previewing}
          checking={checking}
          blackout={blackout}
          columns={columns}
          rows={rows}
          onCardClick={onCardClick}
        />

        {previewing && (
          <div className="preview-label">Remember everything... 👀</div>
        )}
      </section>

      <footer className="game-footer">
        <span>
          {config.version.emoji} {config.version.name}
        </span>
        <span>
          {matched.size / 2} / {config.pairs}
        </span>
      </footer>
    </main>
  );
}
