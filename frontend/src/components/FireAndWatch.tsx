import { StatsPanel } from "./StatsPanel";
import { EventTrigger } from "./EventTrigger";
import { DeliveryFeed } from "./DeliveryFeed";
import { ReceiverControl } from "./ReceiverControl";
import { Panel } from "./Panel";
import type {
  DeliveryStats,
  RecentAttempt,
  ReceiverConfig,
  Subscription,
} from "../types";

interface FireAndWatchProps {
  stats: DeliveryStats | null;
  recent: RecentAttempt[] | null;
  receiverConfig: ReceiverConfig | null;
  subscriptions: Subscription[];
  onFired: () => void;
  onReceiverChanged: () => void;
}

export function FireAndWatch({
  stats,
  recent,
  receiverConfig,
  subscriptions,
  onFired,
  onReceiverChanged,
}: FireAndWatchProps) {
  return (
    <div className="space-y-6">
      <StatsPanel stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel eyebrow="Simulate" title="Fire test event">
          <EventTrigger subscriptions={subscriptions} onFired={onFired} />
        </Panel>
        <Panel eyebrow="Receiver" title="Simulated customer endpoint">
          <ReceiverControl
            config={receiverConfig}
            onChanged={onReceiverChanged}
          />
        </Panel>
        <Panel eyebrow="Live feed" title="Recent deliveries">
          <DeliveryFeed entries={recent} />
        </Panel>
      </div>
    </div>
  );
}
