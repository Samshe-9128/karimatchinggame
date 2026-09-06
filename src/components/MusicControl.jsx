export default function MusicControl({ musicOn, toggleMusic, hasMusic }) {
  if (!hasMusic) {
    return null;
  }

  return (
    <button
      type="button"
      className={`music-control ${musicOn ? "music-on" : "music-off"}`}
      onClick={toggleMusic}
      aria-label={musicOn ? "Turn music off" : "Turn music on"}
    >
      <span className="music-symbol">{musicOn ? "♫" : "×"}</span>

      <span>{musicOn ? "Music on" : "Music off"}</span>
    </button>
  );
}
