import { Injectable } from '@nestjs/common';

export type FailureMode = 'none' | 'always-fail' | 'slow' | 'down';

@Injectable()
export class ReceiverConfigService {
  private secret: string | null = null;
  private failureMode: FailureMode = 'none';

  setSecret(secret: string) {
    this.secret = secret;
  }

  getSecret(): string | null {
    return this.secret;
  }

  setFailureMode(mode: FailureMode) {
    this.failureMode = mode;
  }

  getFailureMode(): FailureMode {
    return this.failureMode;
  }
}
