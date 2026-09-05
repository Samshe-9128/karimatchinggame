export default function MusicControl({
  musicOn,
  setMusicOn,
  hasMusic,
}) {
  if (!hasMusic) {
    return null;
  }

  return (
    <button
      className={`music-control ${
        musicOn
          ? "music-on"
          : "music-off"
      }`}
      onClick={() =>
        setMusicOn(
          (value) => !value,
        )
      }
      aria-label={
        musicOn
          ? "Turn music off"
          : "Turn music on"
      }
    >
      <span className="music-symbol">
        {musicOn ? "♫" : "×"}
      </span>

      {musicOn
        ? "Music on"
        : "Music off"}
    </button>
  );
}