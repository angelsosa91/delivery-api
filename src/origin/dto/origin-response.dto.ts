import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OriginResponseDto {
  @ApiProperty({ 
    description: 'Id Origen',
    example: '3c2d580c-6251-11f0-bda6-e668000d17b5'
  })
  id: string;
  
  @ApiProperty({ 
    description: 'Nombre del origen',
    example: 'Casa Matriz'
  })
  name: string;

  @ApiProperty({ 
    description: 'Teléfono',
    example: '0982555333'
  })
  phone: string;

  @ApiProperty({ 
    description: 'Dirección',
    example: 'San Pedro 352 c/ Molas López'
  })
  address: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico',
    example: 'negocio@gmail.com'
  })
  email: string;

  @ApiProperty({ 
    description: 'Latitud',
    example: '-25.3298328'
  })
  latitude: string;

  @ApiProperty({ 
    description: 'Longitud',
    example: '-57.5690995'
  })
  longitude: string;

  @ApiPropertyOptional({ 
    description: 'Referencias',
    example: 'A 100 metros del Ruta 1'
  })
  references: string;

  @ApiProperty({ 
    description: 'Origen Predeterminado',
    example: 'SI/NO'
  })
  default: string;
}