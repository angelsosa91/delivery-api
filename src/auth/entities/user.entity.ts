import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  Index
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './refresh-token.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID único del usuario' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre completo del usuario' })
  @Column({ name: 'full_name'})
  fullName: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Rol del usuario' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({ description: 'Estado del usuario' })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: 'Id Usuario asocaido' })
  @Column({ name: 'user_id'})
  userId: number;

  @ApiProperty({ description: 'Id Empresa' })
  @Column({ name: 'company_id'})
  companyId: number;

  @ApiProperty({ description: 'Si el email ha sido verificado' })
  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @ApiProperty({ description: 'Versión del token, se incrementa al cambiar la contraseña' })
  @Column({ name: 'token_version', default: 0 })
  tokenVersion: number;

  @ApiProperty({ description: 'Fecha del último inicio de sesión' })
  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @ApiProperty({ description: 'Fecha de creación del usuario' })
  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del usuario' })
  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;

  @ApiProperty({ description: 'Fecha de eliminación (soft delete)' })
  @DeleteDateColumn({ name: 'deleted_at'})
  deletedAt: Date;

  // Relación con los tokens de refresco
  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  // Encriptar contraseña antes de insertar o actualizar
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Solo encriptar si se ha modificado la contraseña
    if (this.password && this.password.trim() !== '') {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Método para validar contraseña
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}