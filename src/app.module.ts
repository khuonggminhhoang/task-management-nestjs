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
import {ScheduleModule} from "@nestjs/schedule";
import {BullModule} from "@nestjs/bull";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {CollectionModule} from "@/collection/collection.module";

@Module({
  imports: [ 
    TypeOrmModule.forRoot(dataSourceOptions),       // module này để thao tác với database
    JwtModule.register({                            // module này để xác thực jwt
      secret: config.accessTokenKey,
      global: true
    }),
    ScheduleModule.forRoot(),                       // module này để lập lịch
    BullModule.forRoot({                            // module này để dùng queue  (https://docs.nestjs.com/techniques/queues)
      redis: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT
      }
    }),
    EventEmitterModule.forRoot(),                   // xử lý Event (https://docs.nestjs.com/techniques/events)
    UserModule,
    AuthModule,
    TaskModule,
    CollectionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
