export default function MemoryCard({
  card,
  visible,
  isMatched,
  hinting,
  trapped,
  previewing,
  checking,
  blackout,
  onClick,
}) {
  const specialClass = card.special ? `special-${card.special}` : "";

  return (
    <button
      className={`
        memory-card
        ${visible ? "flipped" : ""}
        ${isMatched ? "matched" : ""}
        ${hinting ? "hinting" : ""}
        ${trapped ? "trapped" : ""}
        ${specialClass}
      `}
      disabled={previewing || checking || blackout || visible || hinting}
      onClick={() => onClick(card.id)}
    >
      <span className="card-inner">
        <span className="card-face card-front">
          {card.emoji}

          {card.special === "golden" && (
            <span className="special-badge">✨</span>
          )}

          {card.special === "freeze" && (
            <span className="special-badge">❄️</span>
          )}

          {card.special === "bomb" && <span className="special-badge">💣</span>}

          {card.special === "trap" && <span className="special-badge">⚠️</span>}
        </span>

        <span className="card-face card-back">✦</span>
      </span>
    </button>
  );
}
