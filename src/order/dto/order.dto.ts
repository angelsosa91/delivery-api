import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({ 
    description: 'Nombre Receptor',
    example: 'Juan Perez'
  })
  @IsNotEmpty()
  @IsString()
  receiverName: string;

  @ApiProperty({ 
    description: 'Teléfono Receptor',
    example: '0982335511'
  })
  @IsNotEmpty()
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

  @ApiProperty({ 
    description: 'Latitud',
    example: '-25.3298328'
  })
  @IsNotEmpty()
  @IsString()
  latitudeFrom: string;

  @ApiProperty({ 
    description: 'Longitud',
    example: '-57.5690995'
  })
  @IsNotEmpty()
  @IsString()
  longitudeFrom: string;

  @ApiProperty({ 
    description: 'Latitud',
    example: '-25.3585123'
  })
  @IsNotEmpty()
  @IsString()
  latitudeTo: string;

  @ApiProperty({ 
    description: 'Longitud',
    example: '-57.510234'
  })
  @IsNotEmpty()
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
  @IsString()
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
}