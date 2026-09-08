import { cn } from "../../lib/utils.js";
const variants = {
  primary:
    "bg-accent text-accent-fg shadow-[var(--shadow-border)] hover:brightness-[1.04] active:scale-[0.98]",
  secondary:
    "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-lift)] active:scale-[0.98]",
  ghost:
    "bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg active:scale-[0.98]",
  icon: "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-lift)] active:scale-[0.98]",
};
const sizes = {
  sm: "h-9 rounded-md px-3 text-sm",
  md: "h-11 rounded-lg px-5 text-sm",
  lg: "h-12 rounded-lg px-6 text-[15px]",
  icon: "size-11 rounded-lg",
};
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,box-shadow,color,opacity] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 select-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
