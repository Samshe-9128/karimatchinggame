import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { MOTIFS } from "../../lib/game/motifs.js";
import { cn } from "../../lib/utils.js";
export function CollectionScreen({ game }) {
    const found = new Set(game.save.collection);
    return (<main className="mx-auto min-h-dvh w-full max-w-3xl px-4 py-6 pb-24 sm:px-6">
      <Button variant="ghost" size="sm" onClick={game.backToMap}>
        <ArrowLeft />
        Path
      </Button>
      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-fg-muted">
        Pressed flowers
      </p>
      <h1 className="mt-1 font-display text-4xl text-fg">Collection</h1>
      <p className="mt-2 text-sm text-fg-muted">
        {found.size} of {MOTIFS.length} motifs remembered.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {MOTIFS.map((m) => {
            const open = found.has(m.id);
            return (<div key={m.id} className={cn("flex aspect-square flex-col items-center justify-center rounded-lg bg-surface shadow-[var(--shadow-border)]", !open && "opacity-35")}>
              <span className="text-3xl leading-none" aria-hidden="true">{m.emoji}</span>
              <span className="mt-2 text-[11px] text-fg-muted">
                {open ? m.name : "—"}
              </span>
            </div>);
        })}
      </div>
    </main>);
}
