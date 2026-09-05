import MemoryCard from "./MemoryCard";

export default function MemoryBoard({
  cards,
  flipped,
  matched,
  trapped,
  hinting,
  previewing,
  checking,
  blackout,
  columns,
  rows,
  onCardClick,
}) {
  return (
    <div
      className={`memory-board ${blackout ? "board-blackout" : ""}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cards.map((card) => {
        const visible = flipped.includes(card.id) || matched.has(card.id);

        const isMatched = matched.has(card.id);

        const isHinting = hinting.includes(card.id);

        const isTrapped = trapped.includes(card.id);

        return (
          <MemoryCard
            key={card.id}
            card={card}
            visible={visible}
            isMatched={isMatched}
            hinting={isHinting}
            trapped={isTrapped}
            previewing={previewing}
            checking={checking}
            blackout={blackout}
            onClick={onCardClick}
          />
        );
      })}

      {blackout && (
        <div className="blackout-overlay">
          <span>🌑</span>
          <strong>BLACKOUT</strong>
          <small>Remember...</small>
        </div>
      )}
    </div>
  );
}
