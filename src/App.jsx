import { useEffect } from "react";
import { useMemoryGame } from "./hooks/useMemoryGame.js";
import {
  resumeIfNeeded,
  setMusicVolume,
  setSfxVolume,
  unlockAudio,
  startAmbient,
} from "./lib/game/audio.js";
import { BreatheOverlay } from "./components/game/BreatheOverlay.jsx";
import { CollectionScreen } from "./components/game/CollectionScreen.jsx";
import { CompanionPanel } from "./components/game/CompanionPanel.jsx";
import { CompleteScreen } from "./components/game/CompleteScreen.jsx";
import { GameScreen } from "./components/game/GameScreen.jsx";
import { HowToScreen } from "./components/game/HowToScreen.jsx";
import { MapScreen } from "./components/game/MapScreen.jsx";
import { RestScreen } from "./components/game/RestScreen.jsx";
import { SettingsPanel } from "./components/game/SettingsPanel.jsx";
import { StatsScreen } from "./components/game/StatsScreen.jsx";

export default function App() {
  const game = useMemoryGame();

  useEffect(() => {
    if (!game.hydrated) return;
    setMusicVolume(game.save.settings.music);
    setSfxVolume(game.save.settings.sfx);
    // Best-effort autoplay. Browsers may require a gesture; the listeners below unlock it.
    unlockAudio();
    startAmbient();
    const unlock = () => {
      unlockAudio();
      if (game.save.settings.music > 0) startAmbient();
    };
    window.addEventListener("pointerdown", unlock, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, {
      once: true,
      passive: true,
    });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [game.hydrated]);

  useEffect(() => {
    if (!game.hydrated) return;
    setMusicVolume(game.save.settings.music);
    setSfxVolume(game.save.settings.sfx);
    if (game.save.settings.music <= 0) return;
    startAmbient();
  }, [game.hydrated, game.save.settings.music, game.save.settings.sfx]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") resumeIfNeeded();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!game.hydrated)
    return <div className="garden-shell" aria-hidden="true" />;

  return (
    <div
      className="garden-shell text-fg"
      data-reduced={game.save.settings.reducedMotion ? "true" : "false"}
    >
      {game.screen === "map" && <MapScreen game={game} />}
      {game.screen === "game" && <GameScreen game={game} />}
      {game.screen === "complete" && <CompleteScreen game={game} />}
      {game.screen === "rest" && <RestScreen game={game} />}
      {game.screen === "stats" && <StatsScreen game={game} />}
      {game.screen === "collection" && <CollectionScreen game={game} />}
      {game.screen === "howto" && <HowToScreen game={game} />}
      <SettingsPanel game={game} />
      <CompanionPanel game={game} />
      <BreatheOverlay game={game} />
    </div>
  );
}
