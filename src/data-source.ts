import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST, // Usar variables de entorno directamente
  port: parseInt(process.env.DATABASE_PORT!, 10), // Convertir a número
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Cargar todas las entidades
  migrations: [__dirname + '/migrations/*{.ts,.js}'], // Cargar todas las migraciones
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true', // Convertir a booleano
  logging: process.env.DATABASE_LOGGING === 'true', // Convertir a booleano
  migrationsRun: process.env.NODE_ENV !== 'development' // Ejecutar migraciones automáticamente en producción
});