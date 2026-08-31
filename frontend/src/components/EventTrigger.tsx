import { useState } from "react";
import { eventsApi } from "../api/resources";
import type { Subscription } from "../types";

function buildPayload(type: string): Record<string, unknown> {
  switch (type) {
    case "order.created":
      return {
        orderId: crypto.randomUUID(),
        amount: Math.round(Math.random() * 10000) / 100,
      };
    case "user.signup":
      return {
        userId: crypto.randomUUID(),
        email: `user${Date.now()}@example.com`,
      };
    case "payment.failed":
      return { paymentId: crypto.randomUUID(), reason: "insufficient_funds" };
    default:
      return {};
  }
}

interface EventTriggerProps {
  subscriptions: Subscription[];
  onFired: () => void;
}

export function EventTrigger({ subscriptions, onFired }: EventTriggerProps) {
  const [firing, setFiring] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const eventTypes = [...new Set(subscriptions.map((s) => s.eventType))];

  async function fire(type: string) {
    setFiring(true);
    setLastResult(null);
    try {
      const result = await eventsApi.fire(type, buildPayload(type));
      setLastResult(
        `Enqueued ${result.enqueuedJobs} job(s) → ${result.deliveringTo.join(", ") || "no subscribers"}`,
      );
      onFired();
    } catch (err) {
      setLastResult(
        err instanceof Error ? err.message : "Failed to fire event",
      );
    } finally {
      setFiring(false);
    }
  }

  if (eventTypes.length === 0) {
    return (
      <p className="text-xs text-[var(--color-text-dim)]">
        No subscriptions yet — use "Edit setup" to add one.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--color-text-dim)]">
        Firing an event notifies <em>every</em> customer subscribed to it, like
        a real webhook system. If others are subscribed too, they'll be listed
        alongside you.
      </p>
      <div className="grid grid-cols-1 gap-2">
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() => fire(type)}
            disabled={firing}
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2 text-sm font-mono text-left text-[var(--color-text)] hover:border-[var(--color-text-dim)] disabled:opacity-50 transition-colors"
          >
            Fire {type}
          </button>
        ))}
      </div>
      {lastResult && (
        <div className="text-xs font-mono text-[var(--color-text-dim)] break-words">
          {lastResult}
        </div>
      )}
    </div>
  );
}
