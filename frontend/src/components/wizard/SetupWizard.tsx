import { useState } from "react";
import { StepIndicator } from "./StepIndicator";
import { CustomerPicker } from "./CustomerPicker";
import { Panel } from "../Panel";
import { SubscriptionForm } from "../SubscriptionForm";
import { SubscriptionList } from "../SubscriptionList";
import type { Customer, ReceiverConfig, Subscription } from "../../types";

const LABELS = ["Customer & Secret", "Subscriptions"];

interface SetupWizardProps {
  startStep: number;
  customers: Customer[];
  subscriptions: Subscription[];
  receiverConfig: ReceiverConfig | null;
  activeId: string | null;
  onCustomerListChanged: () => void;
  onReceiverChanged: () => void;
  onSubscriptionsChanged: () => void;
  onSynced: (id: string) => void;
  onDone?: () => void;
}

export function SetupWizard({
  startStep,
  customers,
  subscriptions,
  receiverConfig,
  activeId,
  onCustomerListChanged,
  onReceiverChanged,
  onSubscriptionsChanged,
  onSynced,
  onDone,
}: SetupWizardProps) {
  const [step, setStep] = useState(startStep);

  const activeSubscriptions = subscriptions.filter(
    (s) => s.customerId === activeId,
  );

  return (
    <div className="max-w-md mx-auto">
      <StepIndicator current={step} total={2} labels={LABELS} />

      {step === 1 && (
        <Panel eyebrow="Step 1 of 2" title="Customer & secret">
          <p className="text-xs text-[var(--color-text-dim)] mb-4">
            Pick who receives webhooks, then sync their secret so the receiver
            can verify deliveries.
          </p>
          <CustomerPicker
            customers={customers}
            receiverConfig={receiverConfig}
            activeId={activeId}
            onCustomerListChanged={onCustomerListChanged}
            onReceiverChanged={onReceiverChanged}
            onSynced={onSynced}
            onContinue={() => setStep(2)}
          />
        </Panel>
      )}

      {step === 2 && (
        <Panel eyebrow="Step 2 of 2" title="Subscriptions">
          <p className="text-xs text-[var(--color-text-dim)] mb-4">
            Choose which event types this customer receives. Add or remove any
            time.
          </p>
          <SubscriptionList
            subscriptions={activeSubscriptions}
            onChanged={onSubscriptionsChanged}
          />
          <SubscriptionForm
            customers={customers.filter((c) => c.id === activeId)}
            onCreated={onSubscriptionsChanged}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep(1)}
              className="px-3 py-2 text-sm font-mono text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
            >
              ← Back
            </button>
            {onDone && activeSubscriptions.length > 0 && (
              <button
                onClick={onDone}
                className="flex-1 bg-[var(--color-text)] text-[var(--color-bg)] rounded px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Done — go to dashboard
              </button>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}
