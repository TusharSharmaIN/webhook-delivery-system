import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';
import { ReceiverConfigService } from './receiver-config.service';
import type { FailureMode } from './receiver-config.service';

class SetSecretDto {
  @ApiProperty({ example: 'customer-uuid-here' })
  @IsString()
  customerId: string;

  @ApiProperty({
    example: 'a099dee62e12841c294fa3d3c4d82d368ecb533f33d62d0e6a72ca3602b47002',
  })
  @IsString()
  secret: string;
}

class SetFailureModeDto {
  @ApiProperty({
    example: 'none',
    enum: ['none', 'always-fail', 'slow', 'down'],
  })
  @IsIn(['none', 'always-fail', 'slow', 'down'])
  mode: FailureMode;
}

@ApiTags('config')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ReceiverConfigService) {}

  @Post('secret')
  @ApiOperation({
    summary: "Register a customer's secret (simulates them saving their key)",
  })
  setSecret(@Body() dto: SetSecretDto) {
    this.configService.setSecret(dto.customerId, dto.secret);
    return { message: 'Secret registered' };
  }

  @Post('failure-mode')
  @ApiOperation({
    summary: 'Simulate receiver failure: none | always-fail | slow | down',
  })
  setFailureMode(@Body() dto: SetFailureModeDto) {
    this.configService.setFailureMode(dto.mode);
    return { message: `Failure mode set to ${dto.mode}` };
  }

  @Get()
  @ApiOperation({ summary: 'View current receiver config' })
  async getConfig() {
    return {
      knownCustomers: await this.configService.countKnown(),
      failureMode: this.configService.getFailureMode(),
    };
  }
}
