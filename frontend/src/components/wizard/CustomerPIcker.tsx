import { useState } from "react";
import { Check } from "lucide-react";
import { customersApi, receiverConfigApi } from "../../api/resources";
import type { Customer, ReceiverConfig } from "../../types";

interface CustomerPickerProps {
  customers: Customer[];
  receiverConfig: ReceiverConfig | null;
  activeId: string | null;
  onCustomerListChanged: () => void;
  onReceiverChanged: () => void;
  onSynced: (id: string) => void;
  onContinue: () => void;
}

export function CustomerPicker({
  customers,
  activeId,
  onCustomerListChanged,
  onReceiverChanged,
  onSynced,
  onContinue,
}: CustomerPickerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(activeId);
  const [creating, setCreating] = useState(customers.length === 0);
  const [name, setName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState(
    "http://receiver:3002/webhooks/incoming",
  );
  const [submitting, setSubmitting] = useState(false);

  const selected = customers.find((c) => c.id === selectedId) ?? null;
  const isActive = selected?.id === activeId;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await customersApi.create(name, webhookUrl);
      onCustomerListChanged();
      setSelectedId(created.id);
      setCreating(false);
      setName("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSync() {
    if (!selected) return;
    await receiverConfigApi.setSecret(selected.id, selected.secret);
    onSynced(selected.id);
    onReceiverChanged();
  }

  return (
    <div className="space-y-4">
      {customers.length > 0 && !creating && (
        <div>
          <label className="block text-xs font-mono text-[var(--color-text-dim)] mb-2">
            Choose a customer
          </label>
          <div className="space-y-1.5">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded border text-left transition-colors ${
                  selectedId === c.id
                    ? "border-[var(--color-text)] text-[var(--color-text)]"
                    : "border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[var(--color-text-dim)]"
                }`}
              >
                <span className="text-sm font-medium flex items-center gap-2">
                  {c.name}
                  {c.id === activeId && (
                    <span className="text-[10px] font-mono uppercase tracking-wide text-[var(--color-status-delivered)]">
                      active
                    </span>
                  )}
                </span>
                <span className="text-xs font-mono">
                  ••••{c.secret.slice(-4)}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setCreating(true)}
            className="mt-2 text-xs font-mono text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors underline"
          >
            + New customer instead
          </button>
        </div>
      )}

      {creating && (
        <form onSubmit={handleCreate} className="space-y-3">
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
          <div className="flex gap-2">
            {customers.length > 0 && (
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="px-3 py-2 text-sm font-mono text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[var(--color-text)] text-[var(--color-bg)] rounded px-3 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {submitting ? "Creating…" : "Create customer"}
            </button>
          </div>
        </form>
      )}

      {selected && !creating && (
        <div className="pt-3 border-t border-[var(--color-border)] space-y-3">
          <div>
            <div className="text-xs font-mono text-[var(--color-text-dim)] mb-1">
              {selected.name}'s secret
            </div>
            <div className="text-xs font-mono text-[var(--color-text)] break-all select-all bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2">
              {selected.secret}
            </div>
          </div>
          <button
            onClick={handleSync}
            disabled={isActive}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded px-3 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isActive ? <Check size={14} /> : null}
            {isActive
              ? "Synced — this is the active customer"
              : "Sync this secret to receiver"}
          </button>
        </div>
      )}

      {selected && (
        <button
          onClick={onContinue}
          disabled={!isActive}
          className="w-full bg-[var(--color-text)] text-[var(--color-bg)] rounded px-3 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          Continue to subscriptions
        </button>
      )}
    </div>
  );
}
