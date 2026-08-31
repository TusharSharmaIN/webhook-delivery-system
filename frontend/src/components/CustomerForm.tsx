import { useState } from "react";
import { customersApi } from "../api/resources";
import type { Customer } from "../types";

interface CustomerFormProps {
  onCreated: (customer: Customer) => void;
}

export function CustomerForm({ onCreated }: CustomerFormProps) {
  const [name, setName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState(
    "http://receiver:3002/webhooks/incoming",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await customersApi.create(name, webhookUrl);
      setName("");
      setWebhookUrl("http://receiver:3002/webhooks/incoming");
      onCreated(created);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create customer",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-mono text-[var(--color-text-dim)] mb-1">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Acme Corp"
          className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-text-dim)]"
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-[var(--color-text-dim)] mb-1">
          Webhook URL
        </label>
        <input
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          required
          className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--color-text-dim)]"
        />
      </div>
      {error && (
        <div className="text-xs text-[var(--color-status-dead)]">{error}</div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[var(--color-text)] text-[var(--color-bg)] rounded px-3 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {submitting ? "Creating…" : "Create customer"}
      </button>
    </form>
  );
}
