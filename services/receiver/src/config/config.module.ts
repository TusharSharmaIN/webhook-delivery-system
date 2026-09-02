import { Module } from '@nestjs/common';
import { ReceiverConfigService } from './receiver-config.service';
import { ConfigController } from './config.controller';
import { SecretsRepository } from './secrets.repository';

@Module({
  providers: [ReceiverConfigService, SecretsRepository],
  controllers: [ConfigController],
  exports: [ReceiverConfigService],
})
export class ConfigModule {}
