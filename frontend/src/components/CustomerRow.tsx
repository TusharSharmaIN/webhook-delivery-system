import { useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import type { Customer } from "../types";

export function CustomerRow({
  customer,
  onDeleted,
}: {
  customer: Customer;
  onDeleted: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function copySecret() {
    await navigator.clipboard.writeText(customer.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    const { customersApi } = await import("../api/resources");
    await customersApi.remove(customer.id);
    onDeleted();
  }

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[var(--color-border)] last:border-0 gap-3">
      <span className="text-[var(--color-text)] w-32 truncate">
        {customer.name}
      </span>
      <span className="text-[var(--color-text-dim)] truncate flex-1">
        secret: ••••••••{customer.secret.slice(-4)}
      </span>
      <button
        onClick={copySecret}
        className="flex items-center gap-1 text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors shrink-0"
        title="Copy secret"
      >
        {copied ? (
          <Check size={13} className="text-[var(--color-status-delivered)]" />
        ) : (
          <Copy size={13} />
        )}
      </button>
      <button
        onClick={handleDelete}
        className={`flex items-center gap-1 shrink-0 transition-colors ${
          confirming
            ? "text-[var(--color-status-dead)]"
            : "text-[var(--color-text-dim)] hover:text-[var(--color-status-dead)]"
        }`}
        title={confirming ? "Click again to confirm" : "Delete customer"}
      >
        <Trash2 size={13} />
        {confirming && <span className="text-xs font-mono">Confirm?</span>}
      </button>
    </div>
  );
}
