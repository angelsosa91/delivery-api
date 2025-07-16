import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderReferenceResponseDto } from './order-reference-response.dto';

export class OrderResponseDto {
  @ApiPropertyOptional({ 
    description: 'Id Orden',
    example: '3c2d580c-6251-11f0-bda6-e668000d17b5'
  })
  id: string;

  @ApiPropertyOptional({ 
    description: 'Nombre Receptor',
    example: 'Juan Perez'
  })
  receiverName: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono Receptor',
    example: '0982335511'
  })
  receiverPhone: string;

  @ApiProperty({ 
    description: 'Descripción del envío',
    example: 'Entregar en edificio Itzael'
  })
  description: string;

  @ApiProperty({ 
    description: 'Medio de Pago',
    example: 'Efectivo/Tarjeta'
  })
  paymentMethod: string;

  @ApiProperty({ 
    description: 'Teléfono Emisor',
    example: '0985221144'
  })
  senderPhone: string;

  @ApiPropertyOptional({ 
    description: 'Latitud',
    example: '-25.3298328'
  })
  latitudeFrom: string;

  @ApiPropertyOptional({ 
    description: 'Longitud',
    example: '-57.5690995'
  })
  longitudeFrom: string;

  @ApiPropertyOptional({ 
    description: 'Latitud',
    example: '-25.3585123'
  })
  latitudeTo: string;

  @ApiPropertyOptional({ 
    description: 'Longitud',
    example: '-57.510234'
  })
  longitudeTo: string;

  @ApiPropertyOptional({ 
    description: 'Comentarios adicionales',
    example: 'Ninguno'
  })
  distance: number;
  
  @ApiPropertyOptional({ 
    description: 'Comentarios adicionales',
    example: 'Ninguno'
  })
  amount: number;
  
  @ApiPropertyOptional({ 
    description: 'Comentarios adicionales',
    example: 'Ninguno'
  })
  deliveryTime: string;

  @ApiPropertyOptional({ 
    description: 'Comentarios adicionales',
    example: 'Ninguno'
  })
  comments: string;

  @ApiProperty({ 
    description: 'Servicio de Ida y Vuelta',
    example: 'SI/NO'
  })
  withReturn: string;

  @ApiProperty({ 
    description: 'Servicio Agendado',
    example: 'SI/NO'
  })
  scheduled: string;

  @ApiProperty({ 
    description: 'Fecha Agenda',
    example: '2025-12-25'
  })
  scheduledDate: string;

  @ApiProperty({ 
    description: 'Requiere Factura',
    example: 'SI/NO'
  })
  invoice: string;

  @ApiProperty({ 
    description: 'Factura Exenta',
    example: 'SI/NO'
  })
  invoiceExempt: string;

  @ApiPropertyOptional({ 
    description: 'Numero de RUC',
    example: '8000222-7'
  })
  invoiceDoc: string;

  @ApiPropertyOptional({ 
    description: 'Razon Social',
    example: 'Empresa SRL'
  })
  invoiceName: string;

  @ApiProperty({ 
    description: 'Deposito en Billetera Electronica',
    example: 'SI/NO'
  })
  wallet: string;

  @ApiProperty({ 
    description: 'Deposito en Banco',
    example: 'SI/NO'
  })
  bank: string;

  @ApiProperty({ 
    description: 'Categoria Vehiculo',
    example: 'MOTOCICLETA/VEHICULOS_LIGEROS'
  })
  deliveryType: string;

  @ApiProperty({ 
    description: 'Disparar evento para realizar pedido de envio a AhoraiteYa directamente',
    example: 'SI/NO'
  })
  directEvent: string;

  @ApiProperty({ 
    description: 'Ya fue enviada al sistema central como solicitud',
    example: 'SI/NO'
  })
  sync: string;

  @ApiProperty({ 
    description: 'Lista de referencias del pedido',
    type: [OrderReferenceResponseDto], // Indica que es un array de OrderReferenceDto
  })
  @Type(() => OrderReferenceResponseDto) // Transforma cada objeto a OrderReferenceDto
  references: OrderReferenceResponseDto[];
}