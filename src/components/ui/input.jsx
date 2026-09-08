export const Input = ({ className = "", ...props }) => (
  <input
    className={`h-11 w-full rounded-md bg-surface px-3.5 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-fg-subtle outline-none transition-[box-shadow] duration-150 focus-visible:shadow-[0_0_0_2px_var(--color-accent)] ${className}`}
    {...props}
  />
);
