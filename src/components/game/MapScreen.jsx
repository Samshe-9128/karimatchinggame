import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Flower2,
  Lock,
  MessageCircle,
  Settings,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { GARDENS, MAX_LEVEL, todayKey } from "../../lib/game/config.js";
import {
  setMusicVolume,
  startAmbient,
  stopAmbient,
  unlockAudio,
} from "../../lib/game/audio.js";
import { cn } from "../../lib/utils.js";
export function MapScreen({ game }) {
  const { save } = game;
  const [jump, setJump] = useState("");
  const [gardenId, setGardenId] = useState(game.currentGarden.id);
  const garden = GARDENS.find((g) => g.id === gardenId) ?? GARDENS[0];
  const done = save.completed.length;
  const dailyReady = save.lastDaily !== todayKey();
  const greeting = "KARI X SAM";
  const muted = save.settings.music <= 0;
  const levels = useMemo(() => {
    const list = [];
    for (let n = garden.from; n <= garden.to; n += 1) list.push(n);
    return list;
  }, [garden]);
  function goJump() {
    const value = Number(jump);
    if (!Number.isInteger(value) || value < 1 || value > save.highestUnlocked) {
      return;
    }
    game.startLevel(value);
    setJump("");
  }
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 pb-24 pt-5 sm:px-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-fg-muted">
            {greeting}
          </p>
          <h1 className="mt-1 font-display text-4xl leading-none text-fg sm:text-5xl">
            Memory game
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="icon"
            size="icon"
            aria-label={muted ? "Unmute garden tone" : "Mute garden tone"}
            onClick={() => {
              unlockAudio();
              if (muted) {
                game.patchSettings({ music: 0.45 });
                setMusicVolume(0.45);
                startAmbient();
              } else {
                game.patchSettings({ music: 0 });
                setMusicVolume(0);
                stopAmbient();
              }
            }}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Button
            variant="icon"
            size="icon"
            aria-label="Ask Iris"
            onClick={() => game.setOverlay("companion")}
          >
            <MessageCircle />
          </Button>
          <Button
            variant="icon"
            size="icon"
            aria-label="Settings"
            onClick={() => game.setOverlay("settings")}
          >
            <Settings />
          </Button>
        </div>
      </header>

      <section className="mt-5 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-fg-subtle">
              Next stop
            </p>
            <p className="font-display text-2xl text-fg">
              Level {save.highestUnlocked}
            </p>
            <p className="mt-1 text-sm text-fg-muted">
              {game.currentGarden.name} · {game.currentGarden.line}
            </p>
          </div>
          <Button onClick={() => game.startLevel(save.highestUnlocked)}>
            Continue
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>
            {done}/{MAX_LEVEL} walked
          </Badge>
          {save.settings.calm && <Badge>Calm path</Badge>}
          {save.dailyStreak > 0 && (
            <Badge>{save.dailyStreak} morning streak</Badge>
          )}
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button
          variant="secondary"
          className="h-auto flex-col items-start gap-1 px-3 py-3"
          onClick={() => game.startDaily()}
        >
          <Sun className="size-4 text-accent" />
          <span className="text-sm font-medium text-fg">
            {dailyReady ? "Today's bloom" : "Bloom done"}
          </span>
        </Button>
        <Button
          variant="secondary"
          className="h-auto flex-col items-start gap-1 px-3 py-3"
          onClick={() => game.setScreen("stats")}
        >
          <Sparkles className="size-4 text-accent" />
          <span className="text-sm font-medium text-fg">Journey</span>
        </Button>
        <Button
          variant="secondary"
          className="h-auto flex-col items-start gap-1 px-3 py-3"
          onClick={() => game.setScreen("collection")}
        >
          <Flower2 className="size-4 text-accent" />
          <span className="text-sm font-medium text-fg">Pressed flowers</span>
        </Button>
        <Button
          variant="secondary"
          className="h-auto flex-col items-start gap-1 px-3 py-3"
          onClick={() => game.setScreen("howto")}
        >
          <BookOpen className="size-4 text-accent" />
          <span className="text-sm font-medium text-fg">How to walk</span>
        </Button>
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          type="number"
          min={1}
          max={save.highestUnlocked}
          placeholder="Jump to a stop"
          value={jump}
          onChange={(e) => setJump(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") goJump();
          }}
        />
        <Button variant="secondary" onClick={goJump}>
          Go
        </Button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {GARDENS.map((g) => {
          const locked = save.highestUnlocked < g.from;
          const active = g.id === gardenId;
          const Icon = g.Icon;
          return (
            <button
              key={g.id}
              type="button"
              disabled={locked}
              onClick={() => setGardenId(g.id)}
              className={cn(
                "flex min-w-[148px] flex-col items-start rounded-lg px-3 py-3 text-left shadow-[var(--shadow-border)] transition-transform duration-200",
                active ? "bg-accent text-accent-fg" : "bg-surface text-fg",
                locked && "opacity-45",
              )}
            >
              <Icon className="size-4" />
              <span className="mt-2 font-display text-lg leading-tight">
                {g.name}
              </span>
              <span
                className={cn(
                  "mt-0.5 text-[11px]",
                  active ? "text-accent-fg/80" : "text-fg-subtle",
                )}
              >
                {g.from}–{g.to}
              </span>
            </button>
          );
        })}
      </div>

      <section className="mt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">
          {garden.name}
        </p>
        <p className="mt-1 text-sm text-fg-muted">{garden.line}</p>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {levels.map((n) => {
            const unlocked = n <= save.highestUnlocked;
            const completed = save.completed.includes(n);
            const current = n === save.highestUnlocked && !completed;
            const boss = n % 20 === 0;
            return (
              <button
                key={n}
                type="button"
                disabled={!unlocked}
                onClick={() => game.startLevel(n)}
                aria-label={`Level ${n}`}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-md text-xs font-medium shadow-[var(--shadow-border)]",
                  unlocked
                    ? "bg-surface text-fg"
                    : "bg-surface-2 text-fg-subtle",
                  completed && "bg-sage-soft text-sage",
                  current && "bg-accent text-accent-fg",
                  boss && unlocked && "ring-1 ring-accent/40",
                )}
              >
                {completed ? (
                  <Check className="size-3.5" />
                ) : unlocked ? (
                  n
                ) : (
                  <Lock className="size-3" />
                )}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
