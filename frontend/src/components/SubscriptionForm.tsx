import { useState } from "react";
import { subscriptionsApi } from "../api/resources";
import type { Customer } from "../types";

interface SubscriptionFormProps {
  customers: Customer[];
  onCreated: () => void;
}

const EVENT_TYPES = ["order.created", "user.signup", "payment.failed"];

export function SubscriptionForm({
  customers,
  onCreated,
}: SubscriptionFormProps) {
  const singleCustomer = customers.length === 1 ? customers[0] : null;
  const [customerId, setCustomerId] = useState(singleCustomer?.id ?? "");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId) return;
    setSubmitting(true);
    setError(null);
    try {
      await subscriptionsApi.create(customerId, eventType);
      onCreated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create subscription",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!singleCustomer && (
        <div>
          <label className="block text-xs font-mono text-[var(--color-text-dim)] mb-1">
            Customer
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-text-dim)]"
          >
            <option value="">Select a customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-xs font-mono text-[var(--color-text-dim)] mb-1">
          Event type
        </label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--color-text-dim)]"
        >
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div className="text-xs text-[var(--color-status-dead)]">{error}</div>
      )}
      <button
        type="submit"
        disabled={submitting || !customerId}
        className="w-full bg-[var(--color-text)] text-[var(--color-bg)] rounded px-3 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {submitting ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
