import { 
    IsEmail, 
    IsString, 
    MinLength, 
    IsNotEmpty, 
    Matches,
    IsOptional,
    IsEnum,
    IsBoolean,
    IsNumber
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  import { UserRole, UserStatus } from '../entities/user.entity';
  
  export class CreateUserDto {
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

    @ApiProperty({ 
      description: 'Company Id asociado',
      example: '1'
    })
    @IsNumber()
    @IsNotEmpty({ message: 'Company Id asociado es requerido' })
    companyId: number;
  
    @ApiPropertyOptional({ 
      description: 'Rol del usuario',
      enum: UserRole,
      default: UserRole.USER
    })
    @IsEnum(UserRole, { message: 'El rol debe ser válido' })
    @IsOptional()
    role?: UserRole;
  
    @ApiPropertyOptional({ 
      description: 'Estado del usuario',
      enum: UserStatus,
      default: UserStatus.ACTIVE
    })
    @IsEnum(UserStatus, { message: 'El estado debe ser válido' })
    @IsOptional()
    status?: UserStatus;
  
    @ApiPropertyOptional({ 
      description: 'Si el email ha sido verificado',
      default: false
    })
    @IsBoolean()
    @IsOptional()
    isEmailVerified?: boolean;
  }