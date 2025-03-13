import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  /**
   * Validación de JWT refresh token
   */
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  /**
   * Manejo de errores específicos para refresh token
   */
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token de refresco inválido o expirado');
    }
    return user;
  }
}