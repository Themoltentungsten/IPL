import type { PropsWithChildren, ReactNode } from "react";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  variant?: "default" | "highlight" | "gold";
}

export function SectionCard({ title, subtitle, action, children, variant = "default" }: SectionCardProps) {
  const border =
    variant === "gold"
      ? "border-amber-500/30"
      : variant === "highlight"
        ? "border-blue-500/30"
        : "border-white/[0.06]";

  return (
    <section
      className={`card-glass rounded-2xl ${border} p-5 shadow-lg shadow-black/30`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
