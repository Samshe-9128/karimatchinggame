export default function HintButton({
  hints,
  onHint,
  disabled,
}) {
  if (hints === null) {
    return null;
  }

  return (
    <button
      className="hint-button"
      onClick={onHint}
      disabled={
        disabled ||
        hints <= 0
      }
    >
      💡 Hint{" "}
      <span>
        ×{hints}
      </span>
    </button>
  );
}