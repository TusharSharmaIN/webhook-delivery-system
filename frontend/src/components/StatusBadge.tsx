interface StatusBadgeProps {
  status: "delivered" | "retrying" | "dead" | "up" | "down";
}

const STATUS_STYLES: Record<string, string> = {
  delivered:
    "bg-[var(--color-status-delivered)]/15 text-[var(--color-status-delivered)]",
  up: "bg-[var(--color-status-delivered)]/15 text-[var(--color-status-delivered)]",
  retrying:
    "bg-[var(--color-status-retrying)]/15 text-[var(--color-status-retrying)]",
  dead: "bg-[var(--color-status-dead)]/15 text-[var(--color-status-dead)]",
  down: "bg-[var(--color-status-dead)]/15 text-[var(--color-status-dead)]",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-mono uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
