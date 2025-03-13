import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { TokensService } from './tokens.service';
import { AuthLogsService } from './auth-logs.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User, UserStatus } from '../entities/user.entity';
import { AuthEventType } from '../entities/auth-log.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private authLogsService: AuthLogsService,
  ) {}

  /**
   * Registrar un nuevo usuario
   */
  async register(
    registerDto: RegisterDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ user: Partial<User>; accessToken: string; refreshToken: string }> {
    try {
      // Crear usuario
      const user = await this.usersService.create({
        fullName: registerDto.fullName,
        email: registerDto.email,
        password: registerDto.password,
      });

      // Registrar evento
      await this.authLogsService.createLog({
        eventType: AuthEventType.REGISTER,
        userId: user.id,
        ipAddress,
        userAgent,
        metadata: { email: user.email },
      });

      // Generar tokens
      const tokens = await this.tokensService.generateTokens(
        user,
        { registrationSource: 'web' },
        ipAddress,
      );

      // Retornar usuario sin datos sensibles
      const { password, ...result } = user;
      return {
        user: result,
        ...tokens,
      };
    } catch (error) {
      // Registrar error si es relevante (por ejemplo, conflicto de email)
      if (error.status === 409) {
        await this.authLogsService.createLog({
          eventType: AuthEventType.REGISTER,
          ipAddress,
          userAgent,
          success: false,
          metadata: { 
            email: registerDto.email,
            error: error.message,
          },
        });
      }
      throw error;
    }
  }

  /**
   * Iniciar sesión
   */
  async login(
    loginDto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ user: Partial<User>; accessToken: string; refreshToken: string }> {
    try {
      // Buscar usuario por email
      let user: User;
      try {
        user = await this.usersService.findByEmail(loginDto.email);
      } catch (error) {
        // Registrar intento fallido - usuario no existe
        await this.authLogsService.createLog({
          eventType: AuthEventType.LOGIN_FAILURE,
          ipAddress,
          userAgent,
          success: false,
          metadata: { 
            email: loginDto.email,
            reason: 'Usuario no encontrado',
          },
        });
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar si la cuenta está activa
      if (user.status !== UserStatus.ACTIVE) {
        // Registrar intento fallido - cuenta no activa
        await this.authLogsService.createLog({
          eventType: AuthEventType.LOGIN_FAILURE,
          userId: user.id,
          ipAddress,
          userAgent,
          success: false,
          metadata: { 
            reason: 'Cuenta no activa',
            status: user.status,
          },
        });
        throw new UnauthorizedException('Esta cuenta no está activa');
      }

      // Verificar contraseña
      const isPasswordValid = await user.validatePassword(loginDto.password);
      if (!isPasswordValid) {
        // Registrar intento fallido - contraseña incorrecta
        await this.authLogsService.createLog({
          eventType: AuthEventType.LOGIN_FAILURE,
          userId: user.id,
          ipAddress,
          userAgent,
          success: false,
          metadata: { reason: 'Contraseña incorrecta' },
        });
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar actividad sospechosa
      const suspiciousActivity = await this.authLogsService.checkSuspiciousActivity(
        user.id,
        ipAddress,
      );

      // Actualizar último inicio de sesión
      await this.usersService.updateLastLogin(user.id);

      // Generar tokens
      const deviceInfo = { 
        userAgent,
        suspicious: suspiciousActivity.suspicious,
      };
      const tokens = await this.tokensService.generateTokens(user, deviceInfo, ipAddress);

      // Registrar inicio de sesión exitoso
      await this.authLogsService.createLog({
        eventType: AuthEventType.LOGIN_SUCCESS,
        userId: user.id,
        ipAddress,
        userAgent,
        metadata: { suspicious: suspiciousActivity.suspicious },
      });

      // Retornar usuario sin datos sensibles
      const { password, ...result } = user;
      return {
        user: result,
        ...tokens,
      };
    } catch (error) {
      // Propagar errores ya manejados
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Registrar otros errores inesperados
      await this.authLogsService.createLog({
        eventType: AuthEventType.LOGIN_FAILURE,
        ipAddress,
        userAgent,
        success: false,
        metadata: { 
          email: loginDto.email,
          error: error.message,
        },
      });
      throw new UnauthorizedException('Error de autenticación');
    }
  }

  /**
   * Refrescar tokens
   */
  async refreshTokens(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const tokens = await this.tokensService.refreshTokens(refreshToken, ipAddress);
      
      // Registrar refresco exitoso
      await this.authLogsService.createLog({
        eventType: AuthEventType.TOKEN_REFRESH,
        // No incluimos userId porque no lo extraemos del token aquí
        ipAddress,
        userAgent,
      });
      
      return tokens;
    } catch (error) {
      // Registrar error de refresco
      await this.authLogsService.createLog({
        eventType: AuthEventType.TOKEN_REFRESH,
        ipAddress,
        userAgent,
        success: false,
        metadata: { error: error.message },
      });
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    // Revocar token
    await this.tokensService.revokeToken(refreshToken);
    
    // Registrar cierre de sesión
    await this.authLogsService.createLog({
      eventType: AuthEventType.LOGOUT,
      userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      await this.usersService.changePassword(userId, currentPassword, newPassword);
      
      // Revocar todos los tokens existentes
      await this.tokensService.revokeAllUserTokens(userId);
      
      // Registrar cambio de contraseña
      await this.authLogsService.createLog({
        eventType: AuthEventType.PASSWORD_CHANGE,
        userId,
        ipAddress,
        userAgent,
      });
    } catch (error) {
      // Registrar error de cambio de contraseña
      await this.authLogsService.createLog({
        eventType: AuthEventType.PASSWORD_CHANGE,
        userId,
        ipAddress,
        userAgent,
        success: false,
        metadata: { error: error.message },
      });
      throw error;
    }
  }
}