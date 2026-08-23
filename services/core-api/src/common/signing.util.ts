import { createHmac } from 'crypto';

/**
 * Signs a payload with HMAC-SHA256 using the customer's secret.
 * Receivers use the same algorithm + their known secret to verify
 * the request genuinely came from us and wasn't tampered with.
 */
export function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}
