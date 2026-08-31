import { coreApi, receiverApi } from "./client";
import type {
  Customer,
  Subscription,
  EventRecord,
  DeadLetterEntry,
  DeliveryStats,
  ReceiverConfig,
  FailureMode,
  RecentAttempt,
} from "../types";

export const customersApi = {
  list: () => coreApi.get<Customer[]>("/customers"),
  create: (name: string, webhookUrl: string) =>
    coreApi.post<Customer>("/customers", { name, webhookUrl }),
  remove: (id: string) =>
    coreApi.delete<{ deleted: boolean }>(`/customers/${id}`),
};

export const subscriptionsApi = {
  list: () => coreApi.get<Subscription[]>("/subscriptions"),
  create: (customerId: string, eventType: string) =>
    coreApi.post<Subscription>("/subscriptions", { customerId, eventType }),
  remove: (id: string) =>
    coreApi.delete<{ deleted: boolean }>(`/subscriptions/${id}`),
};

export const eventsApi = {
  list: () => coreApi.get<EventRecord[]>("/events"),
  fire: (type: string, payload: Record<string, unknown>) =>
    coreApi.post<{
      event: EventRecord;
      enqueuedJobs: number;
      deliveringTo: string[];
    }>("/events", { type, payload }),
};

export const deadLetterApi = {
  list: () => coreApi.get<DeadLetterEntry[]>("/dead-letter"),
  recent: () => coreApi.get<RecentAttempt[]>("/dead-letter/recent"),
  stats: () => coreApi.get<DeliveryStats>("/dead-letter/stats/summary"),
};

export const receiverConfigApi = {
  get: () => receiverApi.get<ReceiverConfig>("/config"),
  setFailureMode: (mode: FailureMode) =>
    receiverApi.post<{ message: string }>("/config/failure-mode", { mode }),
  setSecret: (customerId: string, secret: string) =>
    receiverApi.post<{ message: string }>("/config/secret", {
      customerId,
      secret,
    }),
};
