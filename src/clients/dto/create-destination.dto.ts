import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateDestinationDto {
  @IsNotEmpty()
  @IsString()
  idMpCliente: string;

  @IsOptional()
  @IsString()
  idPedido?: string;

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
  @IsString()
  estado?: string;

  @IsOptional()
  @IsDateString()
  horaEntrega?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  comentarioMoto?: string;

  @IsOptional()
  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsNumber()
  distancia?: number;

  @IsOptional()
  @IsNumber()
  idEmisor?: number;

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