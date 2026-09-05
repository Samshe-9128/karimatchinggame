import "./App.css";

import MusicControl from "./components/MusicControl";
import MapScreen from "./components/MapScreen";
import GameScreen from "./components/GameScreen";
import CompleteScreen from "./components/CompleteScreen";
import LostScreen from "./components/LostScreen";
import StatsScreen from "./components/StatsScreen";

import useMusic from "./hooks/useMusic";
import useMemoryGame from "./hooks/useMemoryGame";

export default function App() {
  const music = useMusic();
  const game = useMemoryGame();

  return (
    <div className="app">
      <MusicControl
        musicOn={music.musicOn}
        setMusicOn={music.setMusicOn}
        hasMusic={music.hasMusic}
      />

      {game.screen === "map" && (
        <MapScreen
          highestUnlocked={game.highestUnlocked}
          completedLevels={game.completedLevels}
          onStartLevel={game.startLevel}
          onStats={game.openStats}
        />
      )}

      {game.screen === "game" && (
        <GameScreen
          level={game.level}
          cards={game.cards}
          flipped={game.flipped}
          matched={game.matched}
          trapped={game.trapped}
          moves={game.moves}
          score={game.score}
          combo={game.combo}
          lives={game.lives}
          hints={game.hints}
          previewing={game.previewing}
          checking={game.checking}
          timeLeft={game.timeLeft}
          hinting={game.hinting}
          blackout={game.blackout}
          config={game.config}
          onHint={game.useHint}
          onCardClick={game.handleCardClick}
          onBack={game.backToMap}
        />
      )}

      {game.screen === "complete" && (
        <CompleteScreen
          level={game.level}
          moves={game.moves}
          score={game.score}
          hiddenMessage={game.hiddenMessage}
          traveling={game.traveling}
          combo={game.combo}
          lives={game.lives}
          onNext={game.goToNextLevel}
          onBack={game.backToMap}
        />
      )}

      {game.screen === "lost" && (
        <LostScreen
          level={game.level}
          onRetry={() => game.startLevel(game.level)}
          onBack={game.backToMap}
        />
      )}

      {game.screen === "stats" && (
        <StatsScreen
          highestUnlocked={game.highestUnlocked}
          completedLevels={game.completedLevels}
          stats={game.stats}
          onBack={() => game.backToMap()}
        />
      )}
    </div>
  );
}
