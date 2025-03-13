import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controladores
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';

// Servicios
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { TokensService } from './services/tokens.service';
import { AuthLogsService } from './services/auth-logs.service';

// Estrategias
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

// Entidades
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthLog } from './entities/auth-log.entity';

@Module({
  imports: [
    // Registro de entidades con TypeORM
    TypeOrmModule.forFeature([User, RefreshToken, AuthLog]),

    // Configuración de Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configuración de JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.accessToken.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.accessToken.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    // Servicios
    UsersService,
    AuthService,
    TokensService,
    AuthLogsService,

    // Estrategias
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [
    // Servicios exportados para uso en otros módulos
    UsersService,
    AuthService,
    TokensService,
    AuthLogsService,
  ],
})
export class AuthModule {}