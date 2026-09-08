import { Button } from "../ui/button.jsx";
export function RestScreen({ game }) {
    return (<main className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-5 py-10">
      <div className="w-full rounded-2xl bg-surface p-7 text-center shadow-[var(--shadow-lift)] rise-in sm:p-9">
        <div className="breathe-orb mx-auto mb-5 size-16 rounded-full bg-accent-soft"/>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-fg-muted">
          {game.isDaily ? "Today's bloom" : `Stop ${game.level}`}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-fg">
          Rest a moment
        </h1>
        <p className="mx-auto mt-4 max-w-[38ch] text-[15px] leading-relaxed text-fg-muted">
          The garden is still here. Nothing is lost. You can try the same
          picture again, or walk back and breathe.
        </p>
        <Button className="mt-7 w-full" onClick={game.restartLevel}>
          Look again
        </Button>
        <Button className="mt-2 w-full" variant="secondary" onClick={game.backToMap}>
          Return to the path
        </Button>
        <Button className="mt-2 w-full" variant="ghost" onClick={() => game.setOverlay("breathe")}>
          One slow breath
        </Button>
      </div>
    </main>);
}
