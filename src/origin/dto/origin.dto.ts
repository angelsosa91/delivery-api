import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OriginDto {
  @ApiProperty({ 
    description: 'Nombre del origen',
    example: 'Casa Matriz'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Teléfono',
    example: '0982555333'
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ 
    description: 'Dirección',
    example: 'San Pedro 352 c/ Molas López'
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico',
    example: 'negocio@gmail.com'
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

  @ApiProperty({ 
    description: 'Origen Predeterminado',
    example: 'SI/NO'
  })
  @IsNotEmpty()
  @IsString()
  default: string;
}