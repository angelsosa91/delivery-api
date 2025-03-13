import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { AuthLogsService } from '../services/auth-logs.service';
import { AuthEventType } from '../entities/auth-log.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authLogsService: AuthLogsService,
  ) {}

  /**
   * Verificar si el usuario tiene los roles requeridos
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener roles requeridos para la ruta
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtener request y usuario
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario o no tiene rol, denegar acceso
    if (!user || !user.role) {
      throw new ForbiddenException('Acceso denegado - se requiere autenticación con rol');
    }

    // Verificar si el usuario tiene el rol requerido
    const hasRequiredRole = requiredRoles.includes(user.role);

    // Si no tiene el rol, registrar intento y denegar
    if (!hasRequiredRole) {
      // Registrar intento de acceso no autorizado
      await this.authLogsService.createLog({
        eventType: AuthEventType.ACCESS_DENIED,
        userId: user.id,
        ipAddress: request.ip,
        userAgent: request.get('user-agent'),
        success: false,
        metadata: {
          url: request.originalUrl,
          method: request.method,
          requiredRoles,
          userRole: user.role,
        },
      });

      throw new ForbiddenException('No tienes los permisos necesarios para acceder a este recurso');
    }

    return true;
  }
}