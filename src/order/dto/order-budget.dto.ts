import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderBudgetDto {
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

  @ApiProperty({ 
    description: 'Servicio de Ida y Vuelta',
    example: 'SI/NO'
  })
  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  withReturn: string;

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
    description: 'Categoria Vehiculo',
    example: 'MOTOCICLETA/VEHICULOS_LIGEROS'
  })
  @IsNotEmpty()
  @IsEnum(['MOTOCICLETA', 'VEHICULOS_LIGEROS'])
  deliveryType: string;
}