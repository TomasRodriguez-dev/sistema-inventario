import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './configuration';
import { HttpExceptionFilter } from './common/filters/http.exeption.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Sistema de Inventario')
    .setDescription('Documentación de la API de Sistema de Inventario')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentacion-sistema-inventario', app, document);

  await app.listen(envs.port);
  logger.log(`Servidor corriendo en el puerto: ${envs.port}`);
}
bootstrap();
