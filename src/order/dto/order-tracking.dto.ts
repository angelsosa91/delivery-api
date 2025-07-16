import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderTrackingDto {
  @ApiProperty({ 
    description: 'Nombre del Receptor',
    example: 'Carlos Gomez'
  })
  @IsString()
  receptor: string;

  @ApiProperty({ 
    description: 'Telefono del Receptor',
    example: '0987654321'
  })
  @IsString()
  phone: string;

  @ApiProperty({ 
    description: 'Observaciones',
    example: 'Entrega en edificio | Entrega a domicilio'
  })
  @IsString()
  observation: string;

  @ApiProperty({ 
    description: 'Medio de Pago',
    example: 'Efectivo | Tarjeta'
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ 
    description: 'Estado Orden',
    example: 'Pendiente | Aceptado | Cancelado | Entregado'
  })
  @IsString()
  status: string;

  @ApiProperty({ 
    description: 'Nombre Driver',
    example: 'Juan Perez'
  })
  @IsString()
  driver: string;

  @ApiProperty({ 
    description: 'Telefono Driver',
    example: '0981111222'
  })
  @IsString()
  driverPhone: string;

  constructor(receptor: string, phone: string, observation: string, paymentMethod: string, status: string, driver: string, driverPhone: string) {
    this.receptor = receptor;
    this.phone = phone;
    this.observation = observation;
    this.paymentMethod = paymentMethod;
    this.status = status;
    this.driver = driver;
    this.driverPhone = driverPhone;
  }
}