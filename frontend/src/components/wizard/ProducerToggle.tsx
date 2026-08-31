import { useState, useEffect, useCallback } from "react";
import { Play, Pause, Radio } from "lucide-react";

const EVENT_SOURCE_URL = import.meta.env.VITE_EVENT_SOURCE_URL as string;

export function useProducerStatus() {
  const [paused, setPaused] = useState<boolean | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${EVENT_SOURCE_URL}/producer`);
      const data = await res.json();
      setPaused(data.paused);
    } catch {
      setPaused(null);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 4000); // keep banner in sync even if toggled elsewhere
    return () => clearInterval(id);
  }, [fetchStatus]);

  async function toggle() {
    const endpoint = paused ? "resume" : "pause";
    await fetch(`${EVENT_SOURCE_URL}/producer/${endpoint}`, { method: "POST" });
    fetchStatus();
  }

  return { paused, toggle };
}

export function ProducerToggleButton({
  paused,
  toggle,
}: {
  paused: boolean | null;
  toggle: () => void;
}) {
  if (paused === null) return null;

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-text-dim)] transition-colors"
    >
      {paused ? <Play size={12} /> : <Pause size={12} />}
      {paused ? "Resume auto-fire" : "Pause auto-fire"}
    </button>
  );
}

export function ProducerBanner({ paused }: { paused: boolean | null }) {
  if (paused !== false) return null; // only show when genuinely running

  return (
    <div className="bg-[var(--color-status-retrying)]/15 border-b border-[var(--color-status-retrying)]/30 px-6 py-2 flex items-center gap-2">
      <Radio
        size={14}
        className="text-[var(--color-status-retrying)] animate-pulse"
      />
      <span className="text-xs font-mono text-[var(--color-status-retrying)]">
        Auto-fire is running — new events will appear on their own every ~10s.
        Pause it above to test in isolation.
      </span>
    </div>
  );
}
