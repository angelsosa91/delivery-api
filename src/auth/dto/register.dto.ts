import { 
    IsEmail, 
    IsString,
    IsNumber,
    MinLength, 
    IsNotEmpty, 
    Matches,
    IsOptional,
    IsBoolean
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export class RegisterDto {
    @ApiProperty({ 
      description: 'Nombre completo del usuario',
      example: 'Juan Pérez'
    })
    @IsString()
    @IsNotEmpty({ message: 'El nombre completo es requerido' })
    fullName: string;
  
    @ApiProperty({ 
      description: 'Correo electrónico del usuario',
      example: 'juan.perez@ejemplo.com'
    })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es requerido' })
    email: string;
  
    @ApiProperty({ 
      description: 'Contraseña (mínimo 8 caracteres, debe incluir letras y números)',
      example: 'Password123'
    })
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, { 
      message: 'La contraseña debe incluir al menos una letra y un número' 
    })
    password: string;

    @ApiProperty({ 
      description: 'Usuario Id asociado',
      example: '1'
    })
    @IsNumber()
    @IsNotEmpty({ message: 'Usuario Id asociado es requerido' })
    userId: number;
  
    @ApiPropertyOptional({ 
      description: 'Aceptación de términos y condiciones',
      default: false
    })
    @IsBoolean()
    @IsOptional()
    acceptTerms?: boolean;
  }