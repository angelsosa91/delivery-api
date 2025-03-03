import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsOptional()
  @IsNumber()
  estado?: number;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsOptional()
  @IsNumber()
  categoriaUsuario?: number;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsNumber()
  rol?: number;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsEnum(['moto', 'bici'])
  car?: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsString()
  categoriaVehiculo?: string;
}