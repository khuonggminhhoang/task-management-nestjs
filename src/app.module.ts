import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './task/task.module';

@Module({
  imports: [ 
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true                  // dùng ở mọi nơi mà không cần imports ở các module khác
    }),
    JwtModule.register({
      secret: 'DEFAULT_KEY',
      global: true
    }),
    UserModule,
    AuthModule,
    TaskModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
