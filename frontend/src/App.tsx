import { useCallback, useEffect, useState } from "react";
import { usePolling } from "./hooks/usePolling";
import { useManualFetch } from "./hooks/useManualFetch";
import { useActiveCustomer } from "./hooks/useActiveCustomer";
import {
  customersApi,
  subscriptionsApi,
  deadLetterApi,
  receiverConfigApi,
} from "./api/resources";
import { SetupWizard } from "./components/wizard/SetupWizard";
import {
  ProducerToggleButton,
  ProducerBanner,
  useProducerStatus,
} from "./components/wizard/ProducerToggle";
import { FireAndWatch } from "./components/FireAndWatch";

function App() {
  const [editing, setEditing] = useState(false);
  const { activeId, setActiveId } = useActiveCustomer();
  const customers = useManualFetch(useCallback(() => customersApi.list(), []));
  const subscriptions = useManualFetch(
    useCallback(() => subscriptionsApi.list(), []),
  );
  const receiverConfig = useManualFetch(
    useCallback(() => receiverConfigApi.get(), []),
  );
  const stats = usePolling(
    useCallback(() => deadLetterApi.stats(), []),
    5000,
  );
  const recent = usePolling(
    useCallback(() => deadLetterApi.recent(), []),
    5000,
  );
  const producer = useProducerStatus();

  useEffect(() => {
    customers.refresh();
    subscriptions.refresh();
    receiverConfig.refresh();
  }, []);

  function refreshSetup() {
    customers.refresh();
    subscriptions.refresh();
    receiverConfig.refresh();
  }

  const activeCustomer = customers.data?.find((c) => c.id === activeId) ?? null;
  const activeSubscriptions = (subscriptions.data ?? []).filter(
    (s) => s.customerId === activeId,
  );
  const activeRecent = (recent.data ?? []).filter(
    (r) => r.customerId === activeId,
  );

  const setupComplete =
    !!activeCustomer &&
    !!receiverConfig.data?.hasSecret &&
    activeSubscriptions.length > 0;

  if (
    customers.data === null ||
    subscriptions.data === null ||
    receiverConfig.data === null
  ) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <span className="text-[var(--color-text-dim)] font-mono text-sm">
          Loading…
        </span>
      </div>
    );
  }

  const startStep = editing ? 1 : !activeCustomer ? 1 : 2;
  const showWizard = editing || !setupComplete;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
      <ProducerBanner paused={producer.paused} />
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mb-0.5">
            Webhook Delivery System
          </div>
          <h1 className="text-lg font-semibold">Control Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          {activeCustomer && !editing && (
            <span className="text-xs font-mono text-[var(--color-text-dim)]">
              Active:{" "}
              <span className="text-[var(--color-text)]">
                {activeCustomer.name}
              </span>
            </span>
          )}
          <ProducerToggleButton
            paused={producer.paused}
            toggle={producer.toggle}
          />
          {setupComplete && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-xs font-mono px-3 py-1.5 rounded border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-text-dim)] transition-colors"
            >
              Switch customer
            </button>
          )}
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {showWizard ? (
          <SetupWizard
            startStep={startStep}
            customers={customers.data ?? []}
            subscriptions={subscriptions.data ?? []}
            receiverConfig={receiverConfig.data}
            activeId={activeId}
            onCustomerListChanged={refreshSetup}
            onReceiverChanged={refreshSetup}
            onSubscriptionsChanged={refreshSetup}
            onSynced={setActiveId}
            onDone={() => setEditing(false)}
          />
        ) : (
          <FireAndWatch
            stats={stats.data}
            recent={activeRecent}
            receiverConfig={receiverConfig.data}
            subscriptions={activeSubscriptions}
            onFired={() => {
              stats.refresh();
              recent.refresh();
            }}
            onReceiverChanged={refreshSetup}
          />
        )}
      </main>
    </div>
  );
}

export default App;
