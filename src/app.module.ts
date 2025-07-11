import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { OriginModule } from './origin/origin.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: async () => ({
        throttlers: [
          {
            ttl: 60,      // tiempo en segundos
            limit: 20,    // máximo de peticiones por IP
          },
        ],
      }),
    }),
    // Configuración global con variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la aplicación
      load: [configuration], // Carga la configuración centralizada
    }),
    
    // Configuración de TypeORM para la base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Cargar todas las entidades
        migrations: [__dirname + '/migrations/*{.ts,.js}'], // Cargar todas las migraciones
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        migrationsRun: configService.get<string>('environment') !== 'development', // Ejecutar migraciones automáticamente en producción
        // Opciones para mejorar la estabilidad de la conexión
        connectTimeout: 20000,
        keepConnectionAlive: true,
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
    
    // Módulos de la aplicación
    AuthModule,
    CustomerModule,
    OrderModule,
    OriginModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}