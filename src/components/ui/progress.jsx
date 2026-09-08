export function Progress({ value, className = "" }) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`h-1 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
