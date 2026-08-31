interface StepIndicatorProps {
  current: number;
  total: number;
  labels: string[];
}

export function StepIndicator({ current, total, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-2 flex-1">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono shrink-0 ${
              step < current
                ? "bg-[var(--color-status-delivered)] text-[var(--color-bg)]"
                : step === current
                  ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                  : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-dim)]"
            }`}
          >
            {step < current ? "✓" : step}
          </div>
          <span
            className={`text-xs font-mono hidden md:inline ${
              step <= current
                ? "text-[var(--color-text)]"
                : "text-[var(--color-text-dim)]"
            }`}
          >
            {labels[step - 1]}
          </span>
          {step < total && (
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          )}
        </div>
      ))}
    </div>
  );
}
