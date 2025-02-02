/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    
  });
  const config = new DocumentBuilder()
    .setTitle('Ecomerce example')
    .setDescription('The Ecomerce API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Ecomerce')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
