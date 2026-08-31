import { useState } from "react";
import { receiverConfigApi } from "../api/resources";
import type { FailureMode, ReceiverConfig } from "../types";

const MODES: { value: FailureMode; label: string }[] = [
  { value: "none", label: "Healthy" },
  { value: "always-fail", label: "Always fail (500)" },
  { value: "slow", label: "Slow (8s, triggers timeout)" },
  { value: "down", label: "Down (no response)" },
];

interface ReceiverControlProps {
  config: ReceiverConfig | null;
  onChanged: () => void;
}

export function ReceiverControl({ config, onChanged }: ReceiverControlProps) {
  const [updating, setUpdating] = useState(false);

  async function setMode(mode: FailureMode) {
    setUpdating(true);
    try {
      await receiverConfigApi.setFailureMode(mode);
      onChanged();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[var(--color-text-dim)]">
          Customers with secrets synced
        </span>
        <span className="text-xs font-mono text-[var(--color-text)]">
          {config?.knownCustomers ?? 0}
        </span>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-mono text-[var(--color-text-dim)]">
          Simulate failure
        </label>
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            disabled={updating}
            className={`w-full text-left px-3 py-2 rounded text-sm font-mono border transition-colors ${
              config?.failureMode === m.value
                ? "border-[var(--color-text)] text-[var(--color-text)]"
                : "border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[var(--color-text-dim)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
