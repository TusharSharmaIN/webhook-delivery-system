import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Liveness check' })
  check() {
    return {
      status: 'ok',
      service: 'receiver',
      timestamp: new Date().toISOString(),
    };
  }
}