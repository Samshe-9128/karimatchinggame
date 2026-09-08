import { ArrowLeft, Heart, Lightbulb, RotateCcw, Settings, Timer, } from "lucide-react";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { Progress } from "../ui/progress.jsx";
import { MemoryBoard } from "./MemoryBoard.jsx";
export function GameScreen({ game }) {
    const { config } = game;
    const progress = config.pairs > 0 ? (game.matched.size / 2 / config.pairs) * 100 : 0;
    const GardenIcon = config.garden.Icon;
    const heading = game.previewing
        ? "Hold the picture"
        : game.checking
            ? "A moment"
            : config.boss
                ? "A gate in the path"
                : "Find the pairs";
    return (<main className="mx-auto flex h-dvh max-h-dvh w-full max-w-4xl flex-col overflow-hidden px-3 pb-2 pt-2 sm:px-5 sm:pt-3">
      <header className="grid shrink-0 grid-cols-[auto_1fr_auto] items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="h-10 px-3" onClick={game.backToMap}>
            <ArrowLeft />
            Path
          </Button>
          <Button variant="icon" size="icon" className="size-10" aria-label="Restart" onClick={game.restartLevel}>
            <RotateCcw />
          </Button>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
            {game.isDaily ? "Today's bloom" : `Stop ${game.level}`}
          </p>
          <p className="font-display text-lg leading-tight text-fg sm:text-xl">
            {config.garden.name}
          </p>
        </div>
        <Button variant="icon" size="icon" className="size-10 justify-self-end" aria-label="Settings" onClick={() => game.setOverlay("settings")}>
          <Settings />
        </Button>
      </header>

      <section className="mt-2 shrink-0 text-center">
        <div className="mb-1.5 flex items-center justify-center gap-2">
          <Badge>
            <GardenIcon className="size-3"/>
            {config.garden.name}
          </Badge>
          {config.boss && <Badge>Gate</Badge>}
          {game.save.settings.calm && <Badge>Calm</Badge>}
        </div>
        <h1 className="font-display text-2xl leading-none text-fg sm:text-3xl">
          {heading}
        </h1>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-fg-muted">
          <span className="tabular">
            Moves {game.moves}
          </span>
          <span className="tabular">Score {game.score}</span>
          {game.timeLeft !== null && (<span className={`tabular inline-flex items-center gap-1 ${game.timeLeft <= 10 ? "text-danger" : ""}`}>
              <Timer className="size-3"/>
              {game.timeLeft}s
            </span>)}
          {game.lives !== null && (<span className="inline-flex items-center gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (<Heart key={i} className={`size-3.5 ${i < game.lives
                    ? "fill-accent text-accent"
                    : "text-fg-subtle"}`}/>))}
            </span>)}
          {game.combo >= 2 && (<span className="tabular text-accent">Combo {game.combo}x</span>)}
        </div>
        {game.hints !== null && (<div className="mt-2">
            <Button variant="secondary" size="sm" onClick={game.useHint} disabled={game.previewing ||
                game.checking ||
                game.blackout ||
                game.hints <= 0}>
              <Lightbulb />
              Hint · {game.hints}
            </Button>
          </div>)}
      </section>

      <Progress value={progress} className="mt-3 shrink-0"/>

      <section className="mt-2 flex min-h-0 flex-1 flex-col">
        <MemoryBoard cards={game.cards} flipped={game.flipped} matched={game.matched} trapped={game.trapped} hinting={game.hinting} previewing={game.previewing} checking={game.checking} blackout={game.blackout} onCardClick={game.handleCardClick}/>
      </section>

      <footer className="mt-2 flex shrink-0 items-center justify-between px-1 text-[11px] text-fg-subtle">
        <span>
          {game.matched.size / 2} / {config.pairs} pairs
        </span>
        <span>{config.garden.line}</span>
      </footer>
    </main>);
}
