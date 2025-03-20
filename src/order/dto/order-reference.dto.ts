import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderReferenceDto {
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
}