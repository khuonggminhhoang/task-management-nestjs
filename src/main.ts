import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'config/system.config';
import { AllExceptionsFilter } from 'filter/all-exception.filter';
import {LoggingService} from "@/common/logging/logging.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService()
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true           // nếu dùng transform: true sẽ tự động chuyển đổi các đối tượng plain (plain objects) từ request body thành instance của các class   
  }));

  // cài swagger
  const configg = new DocumentBuilder()
    .setTitle('Task Management Project')
    .setDescription('API') 
    .setVersion('1.0')
    .addTag('User')
    .addTag('Auth')
    .addTag('Task')
      .addTag('File')
      .addTag('Collection')
    .addBearerAuth()
    .build();
 
  const document = SwaggerModule.createDocument(app, configg);
  SwaggerModule.setup('api', app, document); 
  
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(config.PORT);
}

bootstrap();
