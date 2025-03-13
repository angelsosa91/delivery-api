import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Decorador para especificar qué roles tienen acceso a un endpoint o controlador.
 * 
 * Ejemplo:
 * @Roles(UserRole.ADMIN) - Sólo administradores
 * @Roles(UserRole.ADMIN, UserRole.USER) - Administradores y usuarios normales
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);