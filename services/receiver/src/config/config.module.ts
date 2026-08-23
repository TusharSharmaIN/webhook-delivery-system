import { Module } from '@nestjs/common';
import { ReceiverConfigService } from './receiver-config.service';
import { ConfigController } from './config.controller';

@Module({
  providers: [ReceiverConfigService],
  controllers: [ConfigController],
  exports: [ReceiverConfigService], // webhooks module will need this
})
export class ConfigModule {}
