import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({ 
    description: 'Nombre Cliente',
    example: 'Cliente 1'
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ 
    description: 'Teléfono',
    example: '0985664411'
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ 
    description: 'Dirección',
    example: 'Avda Primer Presidente 558'
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico',
    example: 'cliente@gmail.com'
  })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ 
    description: 'Latitud',
    example: '-25.3298328'
  })
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty({ 
    description: 'Longitud',
    example: '-57.5690995'
  })
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @ApiPropertyOptional({ 
    description: 'Referencias',
    example: 'A 100 metros del Ruta 1'
  })
  @IsOptional()
  @IsString()
  references: string;
}