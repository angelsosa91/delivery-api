import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderCreatedDto {
  @ApiProperty({ 
    description: 'ID Orden',
    example: '42e21053-623c-11f0-bda6-e668000d17b5'
  })
  @IsString()
  orderId: string;

  @ApiProperty({ 
    description: 'Estado Orden',
    example: 'Pendiente | Aceptado | Cancelado | Entregado'
  })
  @IsString()
  status: string;

  constructor(orderId: string, status: string) {
    this.orderId = orderId;
    this.status = status;
  }
}