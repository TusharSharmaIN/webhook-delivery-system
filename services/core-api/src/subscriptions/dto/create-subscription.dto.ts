import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'f5058677-a09c-42d8-9ca4-db84565fbd1b' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: 'order.created' })
  @IsString()
  @IsNotEmpty()
  eventType: string;
}
