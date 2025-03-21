import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

export default new DataSource({
  type: 'mysql', // O el tipo de base de datos que uses
  host: process.env.DB_HOST, // Usar variables de entorno directamente
  port: parseInt(process.env.DB_PORT!, 10), // Convertir a numero
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Cargar todas las entidades
  migrations: [__dirname + '/migrations/*{.ts,.js}'], // Cargar todas las migraciones
  synchronize: process.env.DB_SYNCHRONIZE === 'true', // Convertir a booleano
  logging: process.env.DB_LOGGING === 'true', // Convertir a booleano
  migrationsRun: process.env.NODE_ENV !== 'development', // Ejecutar migraciones automaticamente en producción
});