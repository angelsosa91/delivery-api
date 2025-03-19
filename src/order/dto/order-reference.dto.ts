import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderReferenceDto {
  @ApiProperty({ 
    description: 'Id Pedido',
    example: '421857e4-095d-490e-8228-da393775c7c2'
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiPropertyOptional({ 
    description: 'Nro Documento',
    example: '001-001-0000254'
  })
  @IsOptional()
  @IsString()
  documentNumber: string;

  @ApiPropertyOptional({ 
    description: 'Fecha Agenda',
    example: '2025-12-25'
  })
  @IsOptional()
  @IsString()
  scheduledDate: string;

  @ApiPropertyOptional({ 
    description: 'Observaciones',
    example: 'Observaciones'
  })
  @IsOptional()
  @IsString()
  observation: string;

  @ApiPropertyOptional({ 
    description: 'Ruta Imagen',
    example: '/var/www/public/imagen.png'
  })
  @IsOptional()
  @IsString()
  image: string;
}