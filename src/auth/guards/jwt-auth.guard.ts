import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthLogsService } from '../services/auth-logs.service';
import { AuthEventType } from '../entities/auth-log.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authLogsService: AuthLogsService,
  ) {
    super();
  }

  /**
   * Verificar si la ruta requiere autenticación
   */
  canActivate(context: ExecutionContext) {
    // Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Aplicar validación JWT normal
    return super.canActivate(context);
  }

  /**
   * Manejar errores de autenticación
   */
  handleRequest(err, user, info, context: ExecutionContext) {
    // Obtener request
    const request = context.switchToHttp().getRequest();
    const { ip, originalUrl, method } = request;
    const userAgent = request.get('user-agent');

    // Manejar error de autenticación
    if (err || !user) {
      // Registrar intento de acceso fallido
      this.authLogsService.createLog({
        eventType: AuthEventType.ACCESS_DENIED,
        ipAddress: ip,
        userAgent,
        success: false,
        metadata: {
          url: originalUrl,
          method,
          error: err?.message || 'Usuario no autenticado',
        },
      });

      throw err || new UnauthorizedException('No autorizado');
    }

    // Si todo OK, devolver usuario
    return user;
  }
}