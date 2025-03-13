import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../services/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // Extraer token de cookie
          return request?.cookies?.refreshToken;
        },
        // Alternativa: extraer de header Authorization
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Alternativa: extraer de body
        (request: Request) => {
          const { refreshToken } = request.body;
          if (!refreshToken) {
            return null;
          }
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.refreshToken.secret'),
      passReqToCallback: true,
    });
  }

  /**
   * Validar el refresh token y retornar datos
   */
  async validate(req: Request, payload: any) {
    try {
      // Extraer datos del payload
      const { sub: userId, tokenVersion, family } = payload;

      // Buscar usuario
      const user = await this.usersService.findOne(userId);

      // Verificar si la versión del token coincide
      if (tokenVersion !== user.tokenVersion) {
        throw new UnauthorizedException('Token ha sido invalidado');
      }

      // Extraer el token crudo para validación posterior
      const refreshToken =
        req.cookies?.refreshToken ||
        req.get('Authorization')?.replace('Bearer', '').trim() ||
        req.body?.refreshToken;

      // Retornar datos para uso en controlador
      return {
        id: userId,
        email: user.email,
        refreshToken,
        tokenFamily: family,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token no válido');
    }
  }
}