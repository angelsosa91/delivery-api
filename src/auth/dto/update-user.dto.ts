import { 
    IsEmail, 
    IsString, 
    MinLength, 
    IsOptional,
    Matches,
    IsEnum,
    IsBoolean
  } from 'class-validator';
  import { ApiPropertyOptional } from '@nestjs/swagger';
  import { UserRole, UserStatus } from '../entities/user.entity';
  
  export class UpdateUserDto {
    @ApiPropertyOptional({ 
      description: 'Nombre completo del usuario',
      example: 'Juan Carlos Pérez'
    })
    @IsString()
    @IsOptional()
    fullName?: string;
  
    @ApiPropertyOptional({ 
      description: 'Correo electrónico del usuario',
      example: 'juan.perez.nuevo@ejemplo.com'
    })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsOptional()
    email?: string;
  
    @ApiPropertyOptional({ 
      description: 'Contraseña (mínimo 8 caracteres, debe incluir letras y números)',
      example: 'NewPassword123'
    })
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, { 
      message: 'La contraseña debe incluir al menos una letra y un número' 
    })
    @IsOptional()
    password?: string;
  
    @ApiPropertyOptional({ 
      description: 'Rol del usuario',
      enum: UserRole
    })
    @IsEnum(UserRole, { message: 'El rol debe ser válido' })
    @IsOptional()
    role?: UserRole;
  
    @ApiPropertyOptional({ 
      description: 'Estado del usuario',
      enum: UserStatus
    })
    @IsEnum(UserStatus, { message: 'El estado debe ser válido' })
    @IsOptional()
    status?: UserStatus;
  
    @ApiPropertyOptional({ 
      description: 'Si el email ha sido verificado',
      type: Boolean
    })
    @IsBoolean()
    @IsOptional()
    isEmailVerified?: boolean;
  }