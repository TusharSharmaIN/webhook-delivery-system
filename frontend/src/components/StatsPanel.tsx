import type { DeliveryStats } from "../types";

interface StatsPanelProps {
  stats: DeliveryStats | null;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) return null;

  const items = [
    {
      label: "Total attempts",
      value: stats.totalAttempts,
      color: "text-[var(--color-text)]",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      color: "text-[var(--color-status-delivered)]",
    },
    {
      label: "Retrying",
      value: stats.retrying,
      color: "text-[var(--color-status-retrying)]",
    },
    {
      label: "Dead",
      value: stats.dead,
      color: "text-[var(--color-status-dead)]",
    },
    {
      label: "Success rate",
      value: `${stats.successRate}%`,
      color: "text-[var(--color-text)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3"
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mb-1">
            {item.label}
          </div>
          <div className={`text-2xl font-mono font-semibold ${item.color}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
