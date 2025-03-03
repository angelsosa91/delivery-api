import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateDestinationTempDto {
  @IsOptional()
  @IsNumber()
  idMpCliente?: number;

  @IsOptional()
  @IsNumber()
  idPedido?: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  latitud?: string;

  @IsOptional()
  @IsString()
  longitud?: string;

  @IsOptional()
  @IsNumber()
  distancia?: number;

  @IsOptional()
  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsDateString()
  horaEntrega?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  tiempo?: string;

  @IsOptional()
  @IsString()
  servicio?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsNumber()
  marcador?: number;

  @IsOptional()
  @IsNumber()
  tiempoMinutos?: number;
}