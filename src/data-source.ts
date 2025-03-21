import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
config();

// Intenta importar configuration.ts, pero maneja el error si no existe
let dbConfig;
try {
  const configuration = require('./config/configuration').default;
  dbConfig = configuration().database;
} catch (error) {
  // Si no se puede importar, usa directamente las variables de entorno
  dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true'
  };
}

// Usar rutas absolutas en lugar de __dirname
const entitiesPath = path.join(process.cwd(), 'dist', '**', '*.entity.js');
const migrationsPath = path.join(process.cwd(), 'src', 'migrations', '*.{ts,js}');

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: dbConfig.host || process.env.DB_HOST,
  port: dbConfig.port || parseInt(process.env.DB_PORT || '3306', 10),
  username: dbConfig.username || process.env.DB_USERNAME,
  password: dbConfig.password || process.env.DB_PASSWORD,
  database: dbConfig.database || process.env.DB_DATABASE,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: dbConfig.synchronize || process.env.DB_SYNCHRONIZE === 'true',
  logging: dbConfig.logging || process.env.DB_LOGGING === 'true',
  migrationsRun: process.env.NODE_ENV !== 'development'
});