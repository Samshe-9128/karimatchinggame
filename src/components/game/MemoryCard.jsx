import { Droplets, Flower2, Sparkles, TriangleAlert } from "lucide-react";
import { motifById } from "../../lib/game/motifs.js";
import { cn } from "../../lib/utils.js";

export function MemoryCard({
  card,
  visible,
  isMatched,
  hinting,
  trapped,
  locked,
  onClick,
}) {
  const motif = motifById(card.motifId);
  const emoji = card.emoji ?? motif.emoji;

  return (
    <button
      type="button"
      aria-label={visible ? motif.name : "Hidden card"}
      disabled={locked || visible || hinting}
      onClick={() => onClick(card.id)}
      className={cn(
        "memory-card rounded-md",
        visible && "is-flipped",
        isMatched && "is-matched",
        hinting && "is-hinting",
        trapped && "is-trapped",
        card.special && `special-${card.special}`,
      )}
    >
      <span className="memory-card-inner rounded-md">
        <span className="card-face card-back rounded-md">🌸</span>
        <span className="card-face card-front rounded-md">
          <span className="card-emoji" aria-hidden="true">
            {emoji}
          </span>
          {card.special === "bloom" && (
            <Flower2 className="absolute top-1 right-1 size-3 opacity-70" />
          )}
          {card.special === "dew" && (
            <Droplets className="absolute top-1 right-1 size-3 opacity-70" />
          )}
          {card.special === "storm" && (
            <Sparkles className="absolute top-1 right-1 size-3 opacity-70" />
          )}
          {card.special === "thorn" && (
            <TriangleAlert className="absolute top-1 right-1 size-3 opacity-70" />
          )}
        </span>
      </span>
    </button>
  );
}
