import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'order.created' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: { orderId: '123', amount: 49.99 } })
  @IsObject()
  payload: Record<string, any>;
}
