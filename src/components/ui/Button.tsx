import { cn } from "@/lib/cn";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition shadow-soft";
  const styles =
    variant === "primary"
      ? "bg-brand-600 text-white hover:bg-brand-700"
      : "bg-white text-ink-900 border border-black/10 hover:bg-cream-100";

  return (
    <button className={cn(base, styles, className)} {...props}>
      {children}
    </button>
  );
}
