import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  ruc?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  representante?: string;

  @IsOptional()
  @IsNumber()
  estado?: number;
}