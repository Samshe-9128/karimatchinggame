import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { listAchievements } from "../../lib/game/achievements.js";
import { GARDENS, MAX_LEVEL } from "../../lib/game/config.js";
import { cn } from "../../lib/utils.js";
export function StatsScreen({ game }) {
    const { save } = game;
    const achievements = listAchievements(save);
    const gardensCleared = GARDENS.filter((g) => Array.from({ length: g.to - g.from + 1 }, (_, i) => g.from + i).every((n) => save.completed.includes(n))).length;
    return (<main className="mx-auto min-h-dvh w-full max-w-3xl px-4 py-6 pb-24 sm:px-6">
      <Button variant="ghost" size="sm" onClick={game.backToMap}>
        <ArrowLeft />
        Path
      </Button>
      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-fg-muted">
        Your walk
      </p>
      <h1 className="mt-1 font-display text-4xl text-fg">Journey</h1>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Open" value={String(save.highestUnlocked)}/>
        <Stat label="Walked" value={`${save.completed.length}/${MAX_LEVEL}`}/>
        <Stat label="Best combo" value={`${save.stats.bestCombo}x`}/>
        <Stat label="Perfect stops" value={String(save.stats.perfectLevels)}/>
        <Stat label="Pairs found" value={String(save.stats.totalMatches)}/>
        <Stat label="Score" value={String(save.stats.totalScore)}/>
        <Stat label="Gardens" value={`${gardensCleared}/6`}/>
        <Stat label="Morning streak" value={String(save.dailyStreak)}/>
      </div>

      <h2 className="mt-8 font-display text-2xl text-fg">Marks</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {achievements.map((a) => (<div key={a.id} className={cn("rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]", !a.unlocked && "opacity-50")}>
            <p className="font-medium text-fg">{a.title}</p>
            <p className="mt-1 text-sm text-fg-muted">{a.hint}</p>
          </div>))}
      </div>
    </main>);
}
function Stat({ label, value }) {
    return (<div className="rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      <div className="text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl tabular text-fg">{value}</div>
    </div>);
}
