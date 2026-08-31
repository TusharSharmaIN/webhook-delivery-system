import { Trash2 } from "lucide-react";
import { subscriptionsApi } from "../api/resources";
import type { Subscription } from "../types";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onChanged: () => void;
}

export function SubscriptionList({
  subscriptions,
  onChanged,
}: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <p className="text-xs text-[var(--color-text-dim)] mb-4">
        No subscriptions yet — add one below.
      </p>
    );
  }

  async function handleRemove(id: string) {
    await subscriptionsApi.remove(id);
    onChanged();
  }

  return (
    <div className="mb-4 space-y-1.5 font-mono text-xs">
      {subscriptions.map((sub) => (
        <div
          key={sub.id}
          className="flex items-center justify-between py-1.5 px-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded"
        >
          <span className="text-[var(--color-text)]">{sub.eventType}</span>
          <button
            onClick={() => handleRemove(sub.id)}
            className="text-[var(--color-text-dim)] hover:text-[var(--color-status-dead)] transition-colors"
            title="Remove subscription"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
