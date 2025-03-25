import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  /**
   * Verifica si el entorno actual es producción.
   * @returns boolean
   */
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}