import type { RecentAttempt } from "../types";

const STATUS_ICON: Record<string, string> = {
  delivered: "✓",
  retrying: "↻",
  dead: "✕",
  pending: "…",
};

const STATUS_COLOR: Record<string, string> = {
  delivered: "text-[var(--color-status-delivered)]",
  retrying: "text-[var(--color-status-retrying)]",
  dead: "text-[var(--color-status-dead)]",
  pending: "text-[var(--color-text-dim)]",
};

interface DeliveryFeedProps {
  entries: RecentAttempt[] | null;
}

export function DeliveryFeed({ entries }: DeliveryFeedProps) {
  if (!entries) return null;

  if (entries.length === 0) {
    return (
      <div className="text-[var(--color-text-dim)] text-sm font-mono py-8 text-center">
        No dead letters — everything's delivering cleanly.
      </div>
    );
  }

  return (
    <div className="font-mono text-xs max-h-96 overflow-y-auto">
      {entries.map((entry, i) => (
        <div
          key={`${entry.eventId}-${entry.attemptNumber}-${i}`}
          className="flex items-center gap-3 py-2 border-b border-[var(--color-border)] last:border-0"
        >
          <span className="text-[var(--color-text-dim)] shrink-0 w-24">
            {new Date(entry.attemptedAt).toLocaleTimeString()}
          </span>
          <span className={`${STATUS_COLOR[entry.status]} shrink-0`}>
            {STATUS_ICON[entry.status]}
          </span>
          <span className="text-[var(--color-text)] shrink-0 w-28 truncate">
            {entry.eventType}
          </span>
          <span className="text-[var(--color-text-dim)] shrink-0">→</span>
          <span className="text-[var(--color-text)] shrink-0 w-24 truncate">
            {entry.customerName}
          </span>
          <span className="text-[var(--color-text-dim)] truncate">
            attempt {entry.attemptNumber} · {entry.responseCode ?? "timeout"}
            {entry.error ? ` · ${entry.error}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
