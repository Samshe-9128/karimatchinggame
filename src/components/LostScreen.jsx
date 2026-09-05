export default function LostScreen({ level, onRetry, onBack }) {
  const v2 = level >= 101;

  return (
    <main className="result-page">
      <div className="result-card">
        <div className="result-icon">{v2 ? "💔" : "😭"}</div>

        <p className="eyebrow">LEVEL {level}</p>

        <h1>
          {v2 ? "The road finally got you 😂" : "Okayyy... you got me 😂"}
        </h1>

        <p className="result-message">
          {v2 ? (
            <>
              You ran out of lives.
              <br />
              But the level is still waiting. 👀
            </>
          ) : (
            <>
              Time ran out before you could finish.
              <br />
              Sam isn't judging. Much. 👀
            </>
          )}
        </p>

        <button className="primary-button" onClick={onRetry}>
          Try again
        </button>

        <button className="secondary-button" onClick={onBack}>
          Back to road
        </button>
      </div>
    </main>
  );
}
