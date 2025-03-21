import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import configuration from './config/configuration';

// Cargar variables de entorno
config();

const dbConfig = configuration().database;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: dbConfig.synchronize,
  logging: dbConfig.logging,
  migrationsRun: configuration().environment !== 'development'
});