import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('health')
export class HealthController {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  @Get()
  async check() {
    const coreApiUrl = this.config.get('CORE_API_URL', 'http://core-api:3000');
    let coreApiStatus = 'down';

    try {
      await firstValueFrom(
        this.http.get(`${coreApiUrl}/health`, { timeout: 2000 }),
      );
      coreApiStatus = 'up';
    } catch {
      coreApiStatus = 'down';
    }

    return {
      status: coreApiStatus === 'up' ? 'ok' : 'degraded',
      service: 'event-source',
      timestamp: new Date().toISOString(),
      dependencies: { coreApi: coreApiStatus },
    };
  }
}
