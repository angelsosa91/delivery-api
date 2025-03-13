import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuthLog, AuthEventType } from '../entities/auth-log.entity';

@Injectable()
export class AuthLogsService {
  constructor(
    @InjectRepository(AuthLog)
    private authLogsRepository: Repository<AuthLog>,
  ) {}

  /**
   * Registrar un evento de autenticación
   */
  async createLog(data: {
    eventType: AuthEventType;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    metadata?: Record<string, any>;
  }): Promise<AuthLog> {
    const log = this.authLogsRepository.create({
      eventType: data.eventType,
      userId: data.userId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      success: data.success ?? true,
      metadata: data.metadata,
    });

    return this.authLogsRepository.save(log);
  }

  /**
   * Obtener logs de autenticación para un usuario específico
   */
  async getLogsByUser(
    userId: string,
    options?: {
      eventTypes?: AuthEventType[];
      startDate?: Date;
      endDate?: Date;
      skip?: number;
      take?: number;
    },
  ): Promise<{ logs: AuthLog[]; total: number }> {
    const { eventTypes, startDate, endDate, skip = 0, take = 20 } = options || {};

    // Construir consulta con filtros opcionales
    const queryBuilder = this.authLogsRepository
      .createQueryBuilder('log')
      .where('log.userId = :userId', { userId });

    if (eventTypes && eventTypes.length > 0) {
      queryBuilder.andWhere('log.eventType IN (:...eventTypes)', { eventTypes });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', { endDate });
    }

    // Obtener total y logs paginados
    const total = await queryBuilder.getCount();
    const logs = await queryBuilder
      .skip(skip)
      .take(take)
      .orderBy('log.createdAt', 'DESC')
      .getMany();

    return { logs, total };
  }

  /**
   * Contar intentos fallidos de login recientes
   */
  async countRecentFailedLogins(
    userId: string,
    minutes: number = 30,
  ): Promise<number> {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - minutes);

    const count = await this.authLogsRepository.count({
      where: {
        userId,
        eventType: AuthEventType.LOGIN_FAILURE,
        success: false,
        createdAt: Between(cutoffTime, new Date()),
      },
    });

    return count;
  }

  /**
   * Verificar actividad sospechosa
   */
  async checkSuspiciousActivity(
    userId: string,
    ipAddress?: string,
  ): Promise<{ suspicious: boolean; reason?: string }> {
    // Contar intentos fallidos de login en los últimos 30 minutos
    const recentFailedLogins = await this.countRecentFailedLogins(userId, 30);

    if (recentFailedLogins >= 5) {
      return {
        suspicious: true,
        reason: 'Múltiples intentos fallidos de inicio de sesión',
      };
    }

    // Verificar si es la primera vez que se utiliza esta IP para el usuario
    if (ipAddress) {
      const previousLogins = await this.authLogsRepository.find({
        where: {
          userId,
          eventType: AuthEventType.LOGIN_SUCCESS,
          success: true,
        },
        order: { createdAt: 'DESC' },
        take: 5,
      });

      const hasUsedIpBefore = previousLogins.some(log => log.ipAddress === ipAddress);

      if (previousLogins.length > 0 && !hasUsedIpBefore) {
        return {
          suspicious: true,
          reason: 'Inicio de sesión desde una nueva ubicación',
        };
      }
    }

    return { suspicious: false };
  }
}