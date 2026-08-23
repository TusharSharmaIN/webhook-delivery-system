import { createHmac, timingSafeEqual } from 'crypto';

export function verifySignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');

  // timingSafeEqual prevents timing attacks — a naive `===` comparison leaks
  // information about how many leading characters matched, which an attacker
  // could exploit to guess the correct signature byte-by-byte.
  const expectedBuffer = Buffer.from(expected, 'hex');
  const actualBuffer = Buffer.from(signature, 'hex');

  if (expectedBuffer.length !== actualBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, actualBuffer);
}
