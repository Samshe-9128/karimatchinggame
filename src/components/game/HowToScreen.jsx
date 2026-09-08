import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { HOW_TO } from "../../lib/game/messages.js";
export function HowToScreen({ game }) {
    return (<main className="mx-auto min-h-dvh w-full max-w-xl px-4 py-6 pb-24 sm:px-6">
      <Button variant="ghost" size="sm" onClick={game.backToMap}>
        <ArrowLeft />
        Path
      </Button>
      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-fg-muted">
        A gentle start
      </p>
      <h1 className="mt-1 font-display text-4xl text-fg">How to walk</h1>
      <div className="mt-6 space-y-3">
        {HOW_TO.map((item) => (<article key={item.title} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-2xl text-fg">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {item.body}
            </p>
          </article>))}
      </div>
      <Button className="mt-6 w-full" onClick={() => game.startLevel(1, true)}>
        Begin at Dew Garden
      </Button>
    </main>);
}
