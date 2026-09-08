import { Button } from "../ui/button.jsx";
export function BreatheOverlay({ game }) {
    if (game.overlay !== "breathe")
        return null;
    return (<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/92 px-6 text-center">
      <div className="breathe-orb size-28 rounded-full bg-accent-soft sm:size-36"/>
      <p className="mt-8 font-display text-3xl text-fg">In, and out</p>
      <p className="mt-2 max-w-[32ch] text-sm text-fg-muted">
        Four counts in. Four counts out. The board will wait.
      </p>
      <Button className="mt-8" variant="secondary" onClick={() => game.setOverlay("none")}>
        I am ready
      </Button>
    </div>);
}
