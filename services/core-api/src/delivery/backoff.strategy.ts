/**
 * Exponential backoff with full jitter.
 * Base delay: 10s. Formula: min(cap, base * 2^attempt) * random(0.5, 1.5)
 *
 * Why jitter matters: without it, if a customer's endpoint goes down and
 * 50 events fail at once, all 50 retries would fire at exactly the same
 * moment (10s later, then 20s later, etc.) — hammering an endpoint that's
 * still recovering. Jitter spreads retries out so they don't all collide.
 */
export function exponentialBackoffWithJitter(attemptsMade: number): number {
  const baseDelayMs = 10000;
  const capMs = 80000;
  const exponential = Math.min(
    capMs,
    baseDelayMs * Math.pow(2, attemptsMade - 1),
  );
  const jitterFactor = 0.5 + Math.random(); // random between 0.5 and 1.5
  return Math.round(exponential * jitterFactor);
}
