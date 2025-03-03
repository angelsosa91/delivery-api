import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateOrderReferenceDto {
  @IsNotEmpty()
  @IsNumber()
  idPedidos: number;

  @IsOptional()
  @IsString()
  nroDoc?: string;

  @IsOptional()
  @IsEnum(['ENTREGADO', 'NO ENTREGADO', 'RECHAZADO', 'PENDIENTE'])
  estado?: string;

  @IsOptional()
  @IsString()
  fecha?: string;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @IsString()
  imagen?: string;
}