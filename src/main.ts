import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true           // nếu dùng transform: true sẽ tự động chuyển đổi các đối tượng plain (plain objects) từ request body thành instance của các class   
  }));

  // cài swagger
  const config = new DocumentBuilder()
    .setTitle('Task Management Project')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('User')
    .addTag('Auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
