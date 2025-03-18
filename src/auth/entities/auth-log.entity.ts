import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
  } from 'typeorm';
  import { User } from './user.entity';
  import { ApiProperty } from '@nestjs/swagger';
  
  export enum AuthEventType {
    LOGIN_SUCCESS = 'login_success',
    LOGIN_FAILURE = 'login_failure',
    LOGOUT = 'logout',
    REGISTER = 'register',
    PASSWORD_CHANGE = 'password_change',
    PASSWORD_RESET_REQUEST = 'password_reset_request',
    PASSWORD_RESET_COMPLETE = 'password_reset_complete',
    TOKEN_REFRESH = 'token_refresh',
    TOKEN_REVOKED = 'token_revoked',
    ACCOUNT_LOCKED = 'account_locked',
    ACCOUNT_UNLOCKED = 'account_unlocked',
    SUSPICIOUS_ACTIVITY = 'suspicious_activity',
    ACCESS_DENIED = 'access_denied',
  }
  
  @Entity('auth_logs')
  export class AuthLog {
    @ApiProperty({ description: 'ID único del registro' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty({ description: 'Tipo de evento' })
    @Column({
      name: 'event_type',
      type: 'enum',
      enum: AuthEventType,
    })
    @Index()
    eventType: AuthEventType;
  
    @ApiProperty({ description: 'ID del usuario asociado' })
    @Column({ name: 'user_id', nullable: true })
    @Index()
    userId: string;
  
    @ApiProperty({ description: 'Usuario asociado' })
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id' })
    user: User;
  
    @ApiProperty({ description: 'Dirección IP desde donde se originó el evento' })
    @Column({ name: 'ip_address', nullable: true })
    ipAddress: string;
  
    @ApiProperty({ description: 'User agent del navegador/dispositivo' })
    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent: string;
  
    @ApiProperty({ description: 'Si el evento fue exitoso' })
    @Column({ default: true })
    success: boolean;
  
    @ApiProperty({ description: 'Datos adicionales del evento (JSON)' })
    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;
  
    @ApiProperty({ description: 'Fecha de creación del registro' })
    @CreateDateColumn({ name: 'created_at' })
    @Index()
    createdAt: Date;
  }