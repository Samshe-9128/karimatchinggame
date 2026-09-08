import { useRef, useState } from "react";
import { Flower2, Send } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { OverlayScrim, PanelHeader } from "../ui/panel.jsx";
import { irisFallback } from "../../lib/game/messages.js";

export function CompanionPanel({ game }) {
  const open = game.overlay === "companion";
  const [lines, setLines] = useState(() => [{ from: "iris", text: game.save.name ? `${game.save.name}, the path is open. Tell me how the walk feels, or ask for a little encouragement.` : "The path is open. Tell me how the walk feels, or just sit with the garden." }]);
  const [draft, setDraft] = useState("");
  const countRef = useRef(0);
  function send() {
    const message = draft.trim();
    if (!message) return;
    if (countRef.current >= 12) {
      setLines((p) => [...p, { from: "iris", text: "Let's let the garden speak for a while. Come back after another stop." }]);
      setDraft("");
      return;
    }
    countRef.current += 1;
    setLines((p) => [...p, { from: "you", text: message }, { from: "iris", text: irisFallback(Date.now() + countRef.current) }]);
    game.markTalkedToIris();
    setDraft("");
  }
  return (
    <OverlayScrim open={open} onClose={() => game.setOverlay("none")} labelledBy="iris-title">
      <PanelHeader id="iris-title" title="Iris" onClose={() => game.setOverlay("none")} />
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent"><Flower2 className="size-5" /></div>
          <p className="text-sm text-fg-muted">A quiet little voice for the path.</p>
        </div>
        <div className="min-h-[220px] flex-1 space-y-2 overflow-y-auto pr-1">
          {lines.map((line, i) => <div key={`${line.from}-${i}`} className={line.from === "iris" ? "max-w-[90%] rounded-lg bg-surface-2 px-3 py-2.5 text-sm leading-relaxed text-fg" : "ml-auto max-w-[90%] rounded-lg bg-accent px-3 py-2.5 text-sm leading-relaxed text-accent-fg"}>{line.text}</div>)}
        </div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <Input value={draft} maxLength={400} placeholder="A small thing to say" onChange={(e) => setDraft(e.target.value)} />
          <Button type="submit" size="icon" aria-label="Send"><Send /></Button>
        </form>
      </div>
    </OverlayScrim>
  );
}
