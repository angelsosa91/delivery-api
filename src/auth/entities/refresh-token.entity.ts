import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
  } from 'typeorm';
  import { User } from './user.entity';
  import { ApiProperty } from '@nestjs/swagger';
  
  @Entity('refresh_tokens')
  export class RefreshToken {
    @ApiProperty({ description: 'ID único del token' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty({ description: 'Token de refresco (hash)' })
    @Column()
    token: string;
  
    @ApiProperty({ description: 'ID del usuario asociado' })
    @Column({ name: 'user_id'})
    @Index()
    userId: string;
  
    @ApiProperty({ description: 'Usuario asociado' })
    @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ApiProperty({ description: 'Familia del token (para renovación segura)' })
    @Column()
    @Index()
    family: string;
  
    @ApiProperty({ description: 'Si el token ha sido utilizado' })
    @Column({ name: 'is_used', default: false })
    isUsed: boolean;
  
    @ApiProperty({ description: 'Si el token ha sido revocado' })
    @Column({ name: 'is_revoked', default: false })
    isRevoked: boolean;
  
    @ApiProperty({ description: 'Información del dispositivo (JSON)' })
    @Column({ name: 'device_info', type: 'json', nullable: true })
    deviceInfo: Record<string, any>;
  
    @ApiProperty({ description: 'Dirección IP desde donde se creó el token' })
    @Column({ name: 'ip_address', nullable: true })
    ipAddress: string;
  
    @ApiProperty({ description: 'Versión del token (para validar cambios de contraseña)' })
    @Column({ name: 'token_version' })
    tokenVersion: number;
  
    @ApiProperty({ description: 'Fecha de expiración del token' })
    @Column({ name: 'expires_at' })
    expiresAt: Date;
  
    @ApiProperty({ description: 'Fecha de creación del token' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @ApiProperty({ description: 'Fecha de última actualización del token' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }