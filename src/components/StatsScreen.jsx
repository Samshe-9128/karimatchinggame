import { MAX_LEVEL } from "../utils/gameConfig";

export default function StatsScreen({
  highestUnlocked,
  completedLevels,
  stats,
  onBack,
}) {
  const achievements = [
    {
      icon: "🌸",
      title: "First Match",
      unlocked: completedLevels.size >= 1,
    },
    {
      icon: "🚐",
      title: "Road Trip",
      unlocked: completedLevels.size >= 100,
    },
    {
      icon: "🔥",
      title: "Combo Master",
      unlocked: stats.bestCombo >= 10,
    },
    {
      icon: "🧠",
      title: "Memory Monster",
      unlocked: completedLevels.size >= 500,
    },
    {
      icon: "👑",
      title: "Boss Breaker",
      unlocked: completedLevels.size >= 4000,
    },
    {
      icon: "💗",
      title: "Final Dream",
      unlocked: completedLevels.has(MAX_LEVEL),
    },
  ];

  return (
    <main className="stats-screen">
      <div className="stats-card">
        <button className="back-button" onClick={onBack}>
          ← Road
        </button>

        <p className="eyebrow">KARI × SAM</p>

        <h1>Your Journey 📊</h1>

        <div className="stats-grid">
          <div>
            <small>UNLOCKED</small>
            <strong>{highestUnlocked}</strong>
          </div>

          <div>
            <small>COMPLETED</small>
            <strong>{completedLevels.size}</strong>
          </div>

          <div>
            <small>BEST COMBO</small>
            <strong>🔥 x{stats.bestCombo}</strong>
          </div>

          <div>
            <small>PERFECT LEVELS</small>
            <strong>{stats.perfectLevels}</strong>
          </div>

          <div>
            <small>HINTS USED</small>
            <strong>{stats.hintsUsed}</strong>
          </div>

          <div>
            <small>FAILED LEVELS</small>
            <strong>{stats.failedLevels}</strong>
          </div>

          <div>
            <small>TOTAL MATCHES</small>
            <strong>{stats.totalMatches}</strong>
          </div>

          <div>
            <small>SCORE</small>
            <strong>{stats.totalScore}</strong>
          </div>
        </div>

        <h2>Achievements</h2>

        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className={`achievement ${
                achievement.unlocked ? "unlocked" : "locked"
              }`}
            >
              <span>{achievement.unlocked ? achievement.icon : "🔒"}</span>

              <strong>{achievement.title}</strong>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
