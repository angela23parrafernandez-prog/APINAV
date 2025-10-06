import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //  Habilitar CORS para el frontend Angular/Ionic
  app.enableCors({
    origin: '*', // o mejor restringir a tu dominio
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  //  Servir carpeta de uploads desde el volumen persistente
  const uploadsPath = process.env.UPLOADS_PATH || '/app/uploads';
  app.useStaticAssets(path.resolve(uploadsPath), {
    prefix: '/uploads/',
  });

  //  Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Usuarios')
    .setDescription('Documentación de los controladores de la API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
