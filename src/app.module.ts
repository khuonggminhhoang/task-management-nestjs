import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UserModule } from '@/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { dataSourceOptions } from 'db/data-source';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from '@/task/task.module';
import { config } from 'config/system.config';

@Module({
  imports: [ 
    TypeOrmModule.forRoot(dataSourceOptions),
    JwtModule.register({
      secret: config.accessTokenKey,
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
