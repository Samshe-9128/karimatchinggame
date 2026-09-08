import { Volume2, VolumeX } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { OverlayScrim, PanelHeader } from "../ui/panel.jsx";
import { Switch } from "../ui/switch.jsx";
import { setMusicVolume, setSfxVolume, startAmbient, stopAmbient } from "../../lib/game/audio.js";
import { exportSave, importSaveFromText } from "../../lib/game/storage.js";
export function SettingsPanel({ game }) {
    const { settings } = game.save;
    const open = game.overlay === "settings";
    function onMusic(v) {
        game.patchSettings({ music: v });
        setMusicVolume(v);
        if (v <= 0)
            stopAmbient();
        else
            startAmbient();
    }
    function onSfx(v) {
        game.patchSettings({ sfx: v });
        setSfxVolume(v);
    }
    async function onImport(file) {
        if (!file)
            return;
        const text = await file.text();
        const next = importSaveFromText(text);
        if (next)
            game.replaceSave(next);
    }
    return (<OverlayScrim open={open} onClose={() => game.setOverlay("none")} labelledBy="settings-title">
      <PanelHeader id="settings-title" title="Settings" onClose={() => game.setOverlay("none")}/>
      <div className="space-y-5 overflow-y-auto px-5 pb-6">
        <Row label="Garden tone" hint="A low, slow pad under the path" icon={settings.music <= 0 ? <VolumeX className="size-4"/> : <Volume2 className="size-4"/>}>
          <input type="range" min={0} max={1} step={0.05} value={settings.music} onChange={(e) => onMusic(Number(e.target.value))} className="w-36 accent-[var(--color-accent)]" aria-label="Music volume"/>
        </Row>
        <Row label="Soft sounds" hint="Turns, matches, misses">
          <input type="range" min={0} max={1} step={0.05} value={settings.sfx} onChange={(e) => onSfx(Number(e.target.value))} className="w-36 accent-[var(--color-accent)]" aria-label="Sound effects volume"/>
        </Row>
        <Row label="Calm path" hint="No fail states. Time rests with you.">
          <Switch checked={settings.calm} onCheckedChange={(v) => game.patchSettings({ calm: v })} aria-label="Calm path"/>
        </Row>
        <Row label="Iris notes" hint="Show a line after each stop">
          <Switch checked={settings.notes} onCheckedChange={(v) => game.patchSettings({ notes: v })} aria-label="Iris notes"/>
        </Row>
        <Row label="Quieter motion" hint="Shorter movement if you prefer still">
          <Switch checked={settings.reducedMotion} onCheckedChange={(v) => game.patchSettings({ reducedMotion: v })} aria-label="Reduce motion"/>
        </Row>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="secondary" onClick={() => exportSave(game.save)}>
            Export walk
          </Button>
          <label className="inline-flex h-11 items-center rounded-lg bg-surface px-4 text-sm font-medium shadow-[var(--shadow-border)]">
            Import
            <input type="file" accept="application/json" className="sr-only" onChange={(e) => onImport(e.target.files?.[0])}/>
          </label>
        </div>
        <p className="text-xs leading-relaxed text-fg-subtle">
          Progress lives on this device. Export if you want a copy.
        </p>
      </div>
    </OverlayScrim>);
}
function Row({ label, hint, icon, children, }) {
    return (<div className="flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-fg">
          {icon}
          {label}
        </div>
        <p className="mt-0.5 text-xs text-fg-muted">{hint}</p>
      </div>
      {children}
    </div>);
}
