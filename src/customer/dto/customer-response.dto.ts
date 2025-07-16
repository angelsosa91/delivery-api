import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({ 
    description: 'Id Cliente',
    example: '3c2d580c-6251-11f0-bda6-e668000d17b5'
  })
  id: string;

  @ApiProperty({ 
    description: 'Nombre Cliente',
    example: 'Cliente 1'
  })
  fullName: string;

  @ApiProperty({ 
    description: 'Teléfono',
    example: '0985664411'
  })
  phone: string;

  @ApiProperty({ 
    description: 'Dirección',
    example: 'Avda Primer Presidente 558'
  })
  address: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico',
    example: 'cliente@gmail.com'
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
}