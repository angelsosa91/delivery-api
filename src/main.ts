import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  try {
    // Crear la aplicación NestJS
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Configurar middleware de seguridad
    app.use(helmet());

    // Comprimir respuestas HTTP para mejor rendimiento
    app.use(compression());

    // Validación global de datos de entrada
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Elimina propiedades no esperadas
        forbidNonWhitelisted: true, // Lanza error si hay propiedades no esperadas
        transform: true, // Transforma automáticamente los datos según los tipos DTO
      }),
    );

    // Configurar CORS
    app.enableCors({
      origin: configService.get('CORS_ORIGIN', '*'),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Establecer prefijo global para la API
    app.setGlobalPrefix('');

    if (process.env.NODE_ENV !== 'production') {
      // Configurar Swagger para documentación API
      const swaggerConfig = new DocumentBuilder()
        .setTitle('Auth API')
        .setDescription('API de Integración, Servicio AhoraiteYA')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, swaggerConfig);

      // Ruta para descargar el archivo JSON
      app.use('/docs-json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(document);
      });

      // Ruta de la UI de Swagger
      SwaggerModule.setup('docs', app, document);
    }
    // Iniciar el servidor en el puerto configurado
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    
    console.log(`Aplicación en ejecución en: http://localhost:${port}/api`);
    //console.log(`Documentación disponible en: http://localhost:${port}/api/docs`);
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();