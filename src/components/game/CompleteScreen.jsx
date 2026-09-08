import { ArrowRight, Check, Leaf } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { MAX_LEVEL } from "../../lib/game/config.js";
import { cn } from "../../lib/utils.js";
export function CompleteScreen({ game }) {
  const final = !game.isDaily && game.level === MAX_LEVEL;
  const next = game.level < MAX_LEVEL ? game.level + 1 : null;
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-5 py-10">
      <div className="w-full rounded-2xl bg-surface p-7 text-center shadow-[var(--shadow-lift)] rise-in sm:p-9">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-sage-soft text-sage">
          {final ? <Leaf className="size-7" /> : <Check className="size-7" />}
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-fg-muted">
          {game.isDaily
            ? "Today's bloom"
            : game.config.boss
              ? `Gate ${game.level}`
              : `Stop ${game.level}`}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-fg sm:text-[44px]">
          {final
            ? "The path is complete"
            : game.isDaily
              ? "sweetheart"
              : "kari baby"}
        </h1>
        <p className="mx-auto mt-4 max-w-[40ch] text-[15px] leading-relaxed text-fg-muted">
          {game.hiddenMessage}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Stat label="Moves" value={String(game.moves)} />
          <Stat label="Score" value={String(game.score)} />
          {game.config.v2 && game.combo > 0 && (
            <Stat label="Combo" value={`${game.combo}x`} />
          )}
          {game.lives !== null && (
            <Stat label="Hearts left" value={String(game.lives)} />
          )}
        </div>

        {final ? (
          <Button
            className="mt-6 w-full"
            variant="secondary"
            onClick={game.backToMap}
          >
            Sit with the garden
          </Button>
        ) : game.isDaily ? (
          <Button className="mt-6 w-full" onClick={game.backToMap}>
            Return to the path
          </Button>
        ) : (
          <>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-sage-soft text-sage">
                <Check className="size-3.5" />
              </span>
              <div className="relative h-px flex-1 bg-border">
                <Leaf
                  className={cn(
                    "absolute -top-2.5 size-5 text-accent transition-[left] duration-700",
                    game.traveling ? "left-[86%]" : "left-[6%]",
                  )}
                />
              </div>
              <span className="text-sm text-fg-muted">{next}</span>
            </div>
            <p className="mt-3 text-xs text-fg-subtle">
              {game.traveling ? `Walking to ${next}` : `Stop ${next} is open`}
            </p>
            <Button
              className="mt-4 w-full"
              disabled={game.traveling}
              onClick={game.goToNextLevel}
            >
              {game.traveling ? "On the path" : "Walk on"}
              <ArrowRight />
            </Button>
            <Button
              className="mt-2 w-full"
              variant="ghost"
              onClick={game.backToMap}
            >
              Back to the map
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
function Stat({ label, value }) {
  return (
    <div className="rounded-md bg-surface-2 px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl tabular text-fg">{value}</div>
    </div>
  );
}
