import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-blue text-white hover:bg-blue-dark shadow-sm shadow-blue/20",
  secondary:
    "bg-white text-navy border border-line hover:border-blue hover:text-blue",
  ghost:
    "bg-white/10 text-white border border-white/30 hover:bg-white/20",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
