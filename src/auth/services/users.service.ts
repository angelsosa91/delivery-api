import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Crear un nuevo usuario
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(`El usuario con email ${createUserDto.email} ya existe`);
    }

    // Crear nuevo usuario
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  /**
   * Obtener todos los usuarios con filtros opcionales
   */
  async findAll(options?: {
    role?: UserRole;
    status?: UserStatus;
    isEmailVerified?: boolean;
    skip?: number;
    take?: number;
  }): Promise<{ users: User[]; total: number }> {
    const { role, status, isEmailVerified, skip = 0, take = 10 } = options || {};

    // Construir consulta con filtros opcionales
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (isEmailVerified !== undefined) {
      queryBuilder.andWhere('user.isEmailVerified = :isEmailVerified', { isEmailVerified });
    }

    // Obtener total y usuarios paginados
    const total = await queryBuilder.getCount();
    const users = await queryBuilder
      .skip(skip)
      .take(take)
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    return { users, total };
  }

  /**
   * Buscar usuario por ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    
    return user;
  }

  /**
   * Actualizar datos de usuario
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Verificar si el nuevo email ya existe
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException(`El email ${updateUserDto.email} ya está en uso`);
      }

      // Si se cambia el email, marcarlo como no verificado
      updateUserDto.isEmailVerified = false;
    }

    // Si se actualiza la contraseña, incrementar la versión del token
    if (updateUserDto.password) {
      user.tokenVersion += 1;
    }

    // Actualizar campos
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  /**
   * Cambiar estado de usuario
   */
  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findOne(id);
    user.status = status;
    return this.usersRepository.save(user);
  }

  /**
   * Cambiar rol de usuario
   */
  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findOne(id);
    user.role = role;
    return this.usersRepository.save(user);
  }

  /**
   * Verificar email de usuario
   */
  async verifyEmail(id: string): Promise<User> {
    const user = await this.findOne(id);
    
    if (user.isEmailVerified) {
      throw new BadRequestException('El email ya está verificado');
    }
    
    user.isEmailVerified = true;
    return this.usersRepository.save(user);
  }

  /**
   * Actualizar timestamp de último login
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * Eliminar usuario (soft delete)
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.softDelete(id);
  }

  /**
   * Cambiar contraseña de usuario
   */
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findOne(id);
    
    // Verificar contraseña actual
    const isPasswordValid = await user.validatePassword(currentPassword);
    
    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }
    
    // Actualizar contraseña e incrementar versión del token
    user.password = newPassword;
    user.tokenVersion += 1;
    
    await this.usersRepository.save(user);
  }
}