import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderReferenceResponseDto {
  @ApiPropertyOptional({ 
    description: 'Nro Documento',
    example: '001-001-0000254'
  })
  documentNumber: string;

  @ApiPropertyOptional({ 
    description: 'Fecha Agenda',
    example: '2025-12-25'
  })
  scheduledDate: string;

  @ApiPropertyOptional({ 
    description: 'Observaciones',
    example: 'Observaciones'
  })
  observation: string;
}