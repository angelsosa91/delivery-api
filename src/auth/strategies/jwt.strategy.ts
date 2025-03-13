import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../services/users.service';
import { TokensService } from '../services/tokens.service';
import { UserStatus } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessToken.secret'),
    });
  }

  /**
   * Validar el token JWT y retornar el usuario
   */
  async validate(payload: any) {
    try {
      // Extraer datos del payload
      const { sub: userId, jti: tokenId } = payload;

      // Verificar si el token ha sido revocado
      const isRevoked = await this.tokensService.isTokenRevoked(tokenId);
      if (isRevoked) {
        throw new UnauthorizedException('Token revocado');
      }

      // Buscar usuario
      const user = await this.usersService.findOne(userId);

      // Verificar si el usuario está activo
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Usuario no activo');
      }

      // Retornar datos del usuario (se adjuntan a request.user)
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      };
    } catch (error) {
      throw new UnauthorizedException('Token no válido');
    }
  }
}