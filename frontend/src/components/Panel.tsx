import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Panel({
  title,
  eyebrow,
  children,
  className = "",
  action,
}: PanelProps) {
  return (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg ${className}`}
    >
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <div>
          {eyebrow && (
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mb-0.5">
              {eyebrow}
            </div>
          )}
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            {title}
          </h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
