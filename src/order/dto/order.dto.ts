import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderReferenceDto } from './order-reference.dto';
import { Type } from 'class-transformer';

export class OrderDto {
  @ApiPropertyOptional({ 
    description: 'CustomerId',
    example: 'Id Cliente'
  })
  @IsOptional()
  @IsString()
  customerId: string;

  @ApiPropertyOptional({ 
    description: 'Nombre Receptor',
    example: 'Juan Perez'
  })
  @IsOptional()
  @IsString()
  receiverName: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono Receptor',
    example: '0982335511'
  })
  @IsOptional()
  @IsString()
  receiverPhone: string;

  @ApiProperty({ 
    description: 'Descripción del envío',
    example: 'Entregar en edificio Itzael'
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Medio de Pago',
    example: 'Efectivo/Tarjeta'
  })
  @IsNotEmpty()
  @IsEnum(['Efectivo', 'Tarjeta'])
  paymentMethod: string;

  @ApiProperty({ 
    description: 'Teléfono Emisor',
    example: '0985221144'
  })
  @IsNotEmpty()
  @IsString()
  senderPhone: string;

  @ApiPropertyOptional({ 
    description: 'OriginId',
    example: 'Id Origen'
  })
  @IsOptional()
  @IsString()
  originId: string;

  @ApiPropertyOptional({ 
    description: 'Latitud',
    example: '-25.3298328'
  })
  @IsOptional()
  @IsString()
  latitudeFrom: string;

  @ApiPropertyOptional({ 
    description: 'Longitud',
    example: '-57.5690995'
  })
  @IsOptional()
  @IsString()
  longitudeFrom: string;

  @ApiPropertyOptional({ 
    description: 'Latitud',
    example: '-25.3585123'
  })
  @IsOptional()
  @IsString()
  latitudeTo: string;

  @ApiPropertyOptional({ 
    description: 'Longitud',
    example: '-57.510234'
  })
  @IsOptional()
  @IsString()
  longitudeTo: string;

  @ApiPropertyOptional({ 
    description: 'Comentarios adicionales',
    example: 'Ninguno'
  })
  @IsOptional()
  @IsString()
  comments: string;

  @ApiProperty({ 
    description: 'Servicio de Ida y Vuelta',
    example: 'SI/NO'
  })
  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  withReturn: string;

  @ApiProperty({ 
    description: 'Servicio Agendado',
    example: 'SI/NO'
  })
  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  scheduled: string;

  @ApiProperty({ 
    description: 'Fecha Agenda',
    example: '2025-12-25'
  })
  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ 
    description: 'Requiere Factura',
    example: 'SI/NO'
  })
  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  invoice: string;

  @ApiProperty({ 
    description: 'Factura Exenta',
    example: 'SI/NO'
  })
  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  invoiceExempt: string;

  @ApiPropertyOptional({ 
    description: 'Numero de RUC',
    example: '8000222-7'
  })
  @IsOptional()
  @IsString()
  invoiceDoc: string;

  @ApiPropertyOptional({ 
    description: 'Razon Social',
    example: 'Empresa SRL'
  })
  @IsOptional()
  @IsString()
  invoiceName: string;

  @ApiProperty({ 
    description: 'Deposito en Billetera Electronica',
    example: 'SI/NO'
  })
  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  wallet: string;

  @ApiProperty({ 
    description: 'Deposito en Banco',
    example: 'SI/NO'
  })
  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  bank: string;

  @ApiProperty({ 
    description: 'Disparar evento para realizar pedido de envio a AhoraiteYa directamente',
    example: 'SI/NO'
  })
  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  directEvent: string;

  @ApiProperty({ 
    description: 'Lista de referencias del pedido',
    type: [OrderReferenceDto], // Indica que es un array de OrderReferenceDto
  })
  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto en el array
  @Type(() => OrderReferenceDto) // Transforma cada objeto a OrderReferenceDto
  references: OrderReferenceDto[];
}