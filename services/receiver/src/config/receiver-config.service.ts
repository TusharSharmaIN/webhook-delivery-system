import { Injectable } from '@nestjs/common';

export type FailureMode = 'none' | 'always-fail' | 'slow' | 'down';

@Injectable()
export class ReceiverConfigService {
  private secrets = new Map<string, string>(); // customerId -> secret
  private failureMode: FailureMode = 'none';

  setSecret(customerId: string, secret: string) {
    this.secrets.set(customerId, secret);
  }

  getSecret(customerId: string): string | null {
    return this.secrets.get(customerId) ?? null;
  }

  hasAnySecret(): boolean {
    return this.secrets.size > 0;
  }

  getKnownCustomerIds(): string[] {
    return [...this.secrets.keys()];
  }

  setFailureMode(mode: FailureMode) {
    this.failureMode = mode;
  }

  getFailureMode(): FailureMode {
    return this.failureMode;
  }
}
