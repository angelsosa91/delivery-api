import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
    Res,
    Get,
    Headers,
    UnauthorizedException
  } from '@nestjs/common';
  
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { Request, Response } from 'express';
  import { AuthService } from '../services/auth.service';
  import { RegisterDto } from '../dto/register.dto';
  import { LoginDto } from '../dto/login.dto';
  //import { RefreshTokenDto } from '../dto/refresh-token.dto';
  import { ChangePasswordDto } from '../dto/change-password.dto';
  import { JwtAuthGuard } from '../guards/jwt-auth.guard';
  import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
  import { GetUser } from '../decorators/get-user.decorator';
  import { Public } from '../decorators/public.decorator';
  
  @ApiTags('Autenticación')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Public()
    @Post('register')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    //@ApiBearerAuth()
    //@ApiOperation({ summary: 'Registrar un nuevo usuario' })
    //@ApiResponse({ status: HttpStatus.CREATED, description: 'Usuario registrado exitosamente' })
    //@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
    //@ApiResponse({ status: HttpStatus.CONFLICT, description: 'El email ya está en uso' })
    async register(
      @Body() registerDto: RegisterDto,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
      //@Headers('Authorization') authHeader: string, // Obtener el header 'authorization'
    ) {
      // Definir el token estático que esperas
      /*const STATIC_TOKEN = `Bearer ${process.env.STATIC_AUTH_TOKEN}`;

      // Validar el token del header
      if (!authHeader || authHeader !== STATIC_TOKEN) {
        throw new UnauthorizedException('Token inválido');
      }*/

      const { user, accessToken, refreshToken } = await this.authService.register(
        registerDto,
        req.ip,
        req.get('user-agent'),
      );
  
      // Establecer refresh token en cookie HTTP-only
      this.setRefreshTokenCookie(res, refreshToken);
  
      return {
        user,
        accessToken,
        message: 'Usuario registrado correctamente',
      };
    }
  
    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Inicio de sesión exitoso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Credenciales inválidas' })
    async login(
      @Body() loginDto: LoginDto,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const { user, accessToken, refreshToken } = await this.authService.login(
        loginDto,
        req.ip,
        req.get('user-agent'),
      );
  
      // Establecer refresh token en cookie HTTP-only
      this.setRefreshTokenCookie(res, refreshToken);
  
      return {
        user,
        accessToken,
        message: 'Inicio de sesión exitoso',
      };
    }
  
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Sesión cerrada exitosamente' })
    async logout(
      @GetUser('id') userId: string,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      // Obtener refresh token de cookie
      const refreshToken = req.cookies?.refreshToken;
  
      if (refreshToken) {
        await this.authService.logout(
          userId,
          refreshToken,
          req.ip,
          req.get('user-agent'),
        );
      }
  
      // Limpiar cookie de refresh token
      res.clearCookie('refreshToken');
  
      return {
        message: 'Sesión cerrada exitosamente',
      };
    }
  
    @Public()
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtRefreshGuard)
    @ApiOperation({ summary: 'Refrescar access token usando refresh token' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Token refrescado exitosamente' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token inválido o expirado' })
    async refreshToken(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      // Obtener refresh token de cookie o cuerpo
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  
      const tokens = await this.authService.refreshTokens(
        refreshToken,
        req.ip,
        req.get('user-agent'),
      );
  
      // Establecer nuevo refresh token en cookie
      this.setRefreshTokenCookie(res, tokens.refreshToken);
  
      return {
        accessToken: tokens.accessToken,
        message: 'Token refrescado exitosamente',
      };
    }
  
    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cambiar contraseña' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Contraseña cambiada exitosamente' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Contraseña actual incorrecta' })
    async changePassword(
      @GetUser('id') userId: string,
      @Body() changePasswordDto: ChangePasswordDto,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      await this.authService.changePassword(
        userId,
        changePasswordDto.currentPassword,
        changePasswordDto.newPassword,
        req.ip,
        req.get('user-agent'),
      );
  
      // Limpiar cookie de refresh token
      res.clearCookie('refreshToken');
  
      return {
        message: 'Contraseña cambiada exitosamente. Por favor, inicia sesión de nuevo.',
      };
    }
  
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Perfil de usuario' })
    getProfile(@GetUser() user) {
      return { user };
    }
  
    // Método auxiliar para establecer la cookie de refresh token
    private setRefreshTokenCookie(res: Response, token: string): void {
      res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        path: '/api/auth',
      });
    }
  }