import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: configService.get<boolean>('database.logging'),
});