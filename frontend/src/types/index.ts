export interface Customer {
  id: string;
  name: string;
  webhookUrl: string;
  secret: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  eventType: string;
  createdAt: string;
  customer?: Customer;
}

export interface EventRecord {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export type DeliveryStatus = "pending" | "delivered" | "retrying" | "dead";

export interface DeadLetterEntry {
  eventId: string;
  eventType: string;
  customerName: string;
  finalAttemptNumber: number;
  lastResponseCode: number | null;
  lastError: string;
  diedAt: string;
}

export interface DeliveryStats {
  totalAttempts: number;
  delivered: number;
  retrying: number;
  dead: number;
  successRate: number;
}

export type FailureMode = "none" | "always-fail" | "slow" | "down";

export interface ReceiverConfig {
  knownCustomers: number;
  failureMode: FailureMode;
}

export interface RecentAttempt {
  eventId: string;
  eventType: string;
  customerName: string;
  attemptNumber: number;
  status: DeliveryStatus;
  responseCode: number | null;
  error: string | null;
  attemptedAt: string;
  customerId: string;
}
