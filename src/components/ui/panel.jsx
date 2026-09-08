import { X } from "lucide-react";
import { Button } from "./button.jsx";

export function OverlayScrim({ open, onClose, children, labelledBy }) {
  if (!open) return null;
  return (
    <div className="game-overlay fixed inset-0 z-[100] flex items-end justify-center safe-pad sm:items-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/25"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative z-10 flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-surface shadow-[var(--shadow-lift)] rise-in sm:rounded-2xl"
      >
        {children}
      </div>
    </div>
  );
}
export function PanelHeader({ title, onClose, id }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-5">
      <h2 id={id} className="font-display text-2xl text-fg">
        {title}
      </h2>
      <Button variant="icon" size="icon" onClick={onClose} aria-label="Close">
        <X />
      </Button>
    </div>
  );
}
