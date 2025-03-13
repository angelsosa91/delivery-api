import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole, UserStatus } from '../entities/user.entity';
import { AuthLogsService } from '../services/auth-logs.service';
import { GetUser } from '../decorators/get-user.decorator';

@ApiTags('Usuarios')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authLogsService: AuthLogsService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo usuario (Admin)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'El email ya está en uso' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = user;
    return { user: result };
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de usuarios' })
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  @ApiQuery({ name: 'status', enum: UserStatus, required: false })
  @ApiQuery({ name: 'isEmailVerified', type: Boolean, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async findAll(
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
    @Query('isEmailVerified') isEmailVerified?: boolean,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const skip = (page - 1) * limit;
    const { users, total } = await this.usersService.findAll({
      role,
      status,
      isEmailVerified: isEmailVerified === undefined ? undefined : isEmailVerified === true,
      skip,
      take: limit,
    });

    // Eliminar contraseñas de la respuesta
    const safeUsers = users.map(user => {
      const { password, ...result } = user;
      return result;
    });

    return {
      users: safeUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener un usuario por ID (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuario encontrado' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOne(id);
    const { password, ...result } = user;
    return { user: result };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un usuario (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    const { password, ...result } = user;
    return { user: result };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario (Admin)' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
  }

  @Get(':id/security-logs')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener logs de seguridad de un usuario (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logs de seguridad' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado' })
  async getUserLogs(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    // Verificar que el usuario existe
    await this.usersService.findOne(id);

    // Calcular paginación
    const skip = (page - 1) * limit;

    // Obtener logs
    const { logs, total } = await this.authLogsService.getLogsByUser(id, {
      skip,
      take: limit,
    });

    return {
      logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get('me/security-logs')
  @ApiOperation({ summary: 'Obtener logs de seguridad del usuario actual' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logs de seguridad' })
  async getMyLogs(
    @GetUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    // Calcular paginación
    const skip = (page - 1) * limit;

    // Obtener logs
    const { logs, total } = await this.authLogsService.getLogsByUser(userId, {
      skip,
      take: limit,
    });

    return {
      logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar estado de un usuario (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Estado actualizado exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: UserStatus },
  ) {
    const user = await this.usersService.updateStatus(id, body.status);
    const { password, ...result } = user;
    return { user: result };
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar rol de un usuario (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Rol actualizado exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado' })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { role: UserRole },
  ) {
    const user = await this.usersService.updateRole(id, body.role);
    const { password, ...result } = user;
    return { user: result };
  }

  @Patch(':id/verify-email')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Verificar email de un usuario (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email verificado exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado' })
  async verifyEmail(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.verifyEmail(id);
    const { password, ...result } = user;
    return { user: result };
  }
}