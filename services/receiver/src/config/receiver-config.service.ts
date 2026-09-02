import { Injectable } from '@nestjs/common';
import { SecretsRepository } from './secrets.repository';

export type FailureMode = 'none' | 'always-fail' | 'slow' | 'down';

@Injectable()
export class ReceiverConfigService {
  private failureMode: FailureMode = 'none'; // fine to reset on restart — low stakes

  constructor(private readonly secretsRepo: SecretsRepository) {}

  setSecret(customerId: string, secret: string): Promise<void> {
    return this.secretsRepo.setSecret(customerId, secret);
  }

  getSecret(customerId: string): Promise<string | null> {
    return this.secretsRepo.getSecret(customerId);
  }

  countKnown(): Promise<number> {
    return this.secretsRepo.countKnown();
  }

  setFailureMode(mode: FailureMode) {
    this.failureMode = mode;
  }

  getFailureMode(): FailureMode {
    return this.failureMode;
  }
}
