import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateOriginDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsString()
  latitud?: string;

  @IsOptional()
  @IsString()
  longitud?: string;

  @IsOptional()
  @IsNumber()
  idUsers?: number;

  @IsOptional()
  @IsNumber()
  estado?: number;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsNumber()
  predeterminado?: number;
}