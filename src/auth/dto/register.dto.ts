import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
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
  @IsString()
  documento: string;

  @IsOptional()
  @IsString()
  ciudad: string;

  @IsOptional()
  @IsString()
  direccion: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender: string;
}