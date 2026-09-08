import { useEffect, useRef, useState } from "react";
import { getBoardColumns, getBoardRows } from "../../lib/game/config.js";
import { cn } from "../../lib/utils.js";
import { MemoryCard } from "./MemoryCard.jsx";
export function MemoryBoard({
  cards,
  flipped,
  matched,
  trapped,
  hinting,
  previewing,
  checking,
  blackout,
  onCardClick,
}) {
  const ref = useRef(null);
  const [width, setWidth] = useState(480);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 480;
      setWidth(w);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const columns = getBoardColumns(cards.length, width);
  const rows = getBoardRows(cards.length, columns);
  const locked = previewing || checking || blackout;
  const cell = width < 420 ? 72 : width < 720 ? 96 : 108;
  return (
    <div
      ref={ref}
      className="relative flex h-full w-full min-h-0 items-center justify-center"
    >
      <div
        className={cn(
          "memory-board grid max-h-full max-w-full gap-1.5 sm:gap-2.5",
          blackout && "opacity-40",
        )}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          width: `min(100%, ${columns * cell}px)`,
          height: `min(100%, ${rows * cell}px)`,
          aspectRatio: `${columns} / ${rows}`,
        }}
      >
        {cards.map((card) => {
          const visible = flipped.includes(card.id) || matched.has(card.id);
          return (
            <MemoryCard
              key={card.id}
              card={card}
              visible={visible}
              isMatched={matched.has(card.id)}
              hinting={hinting.includes(card.id)}
              trapped={trapped.includes(card.id)}
              locked={locked}
              onClick={onCardClick}
            />
          );
        })}
      </div>
      {blackout && (
        <div className="blackout-overlay absolute inset-0 z-20 flex flex-col items-center justify-center gap-1 rounded-lg bg-ink/55 text-accent-fg">
          <span className="font-display text-2xl">A passing cloud</span>
          <span className="text-xs tracking-[0.14em] uppercase opacity-80">
            Hold the picture
          </span>
        </div>
      )}
    </div>
  );
}
