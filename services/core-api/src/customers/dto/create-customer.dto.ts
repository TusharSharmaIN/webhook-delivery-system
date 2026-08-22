import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'http://receiver:3002/webhooks/incoming' })
  @IsUrl({ require_tld: false }) // require_tld: false allows http://receiver:3002 (docker hostname, no TLD)
  webhookUrl: string;
}
