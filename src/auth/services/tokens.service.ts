import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UsersService } from './users.service';

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Generar tokens de acceso y refresco para un usuario
   */
  async generateTokens(
    user: User,
    deviceInfo?: any,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Generar token de acceso
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: uuidv4(), // Incluir ID único del token
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get('jwt.accessToken.secret'),
      expiresIn: this.configService.get('jwt.accessToken.expiresIn'),
    });

    // Generar token de refresco con una familia única
    const tokenFamily = uuidv4();
    const refreshTokenPayload = {
      sub: user.id,
      jti: uuidv4(),
      family: tokenFamily,
      tokenVersion: user.tokenVersion,
    };

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get('jwt.refreshToken.secret'),
      expiresIn: this.configService.get('jwt.refreshToken.expiresIn'),
    });

    // Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días

    // Hashear token para almacenamiento seguro
    const hashedToken = await this.hashToken(refreshToken);

    // Almacenar token de refresco en la base de datos
    await this.refreshTokensRepository.save({
      token: hashedToken,
      userId: user.id,
      family: tokenFamily,
      tokenVersion: user.tokenVersion,
      deviceInfo,
      ipAddress,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Refrescar tokens utilizando un token de refresco válido
   */
  async refreshTokens(
    refreshToken: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verificar token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshToken.secret'),
      });

      // Extraer datos del payload
      const { sub: userId, family: tokenFamily, tokenVersion, jti } = payload;

      // Buscar tokens de la misma familia
      const storedTokens = await this.refreshTokensRepository.find({
        where: { family: tokenFamily },
        order: { createdAt: 'DESC' },
      });

      // Obtener el token más reciente de la familia
      const latestToken = storedTokens[0];

      if (!latestToken) {
        throw new UnauthorizedException('Token de refresco inválido');
      }

      // Verificar si el token ha sido usado o revocado
      if (latestToken.isUsed || latestToken.isRevoked) {
        // Posible reutilización de token - revocar toda la familia
        await this.revokeTokenFamily(tokenFamily);
        throw new ForbiddenException('Se detectó reutilización de token');
      }

      // Verificar si la versión del token coincide con la versión actual del usuario
      const user = await this.usersService.findOne(userId);

      if (tokenVersion !== user.tokenVersion) {
        throw new UnauthorizedException('El token ha sido invalidado');
      }

      // Marcar token como usado
      latestToken.isUsed = true;
      await this.refreshTokensRepository.save(latestToken);

      // Generar nuevos tokens
      const deviceInfo = latestToken.deviceInfo;
      return this.generateTokens(user, deviceInfo, ipAddress);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Token de refresco inválido');
    }
  }

  /**
   * Revocar un token de refresco específico
   */
  async revokeToken(token: string): Promise<void> {
    try {
      // Verificar token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.refreshToken.secret'),
      });

      const { family: tokenFamily } = payload;

      // Revocar todos los tokens de la familia
      await this.revokeTokenFamily(tokenFamily);
    } catch (error) {
      // Si el token es inválido o expirado, no hay nada que hacer
    }
  }

  /**
   * Revocar todos los tokens de un usuario
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokensRepository.update(
      { userId },
      { isRevoked: true }
    );
  }

  /**
   * Verificar si un token ha sido revocado
   */
  async isTokenRevoked(jti: string): Promise<boolean> {
    // En una implementación real, podríamos tener una lista negra de tokens
    // Por ahora, simplemente devolvemos false
    return false;
  }

  /**
   * Revocar todos los tokens de una familia
   */
  private async revokeTokenFamily(family: string): Promise<void> {
    await this.refreshTokensRepository.update(
      { family },
      { isRevoked: true }
    );
  }

  /**
   * Hashear un token para almacenamiento seguro
   */
  private async hashToken(token: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(token, salt);
  }
}