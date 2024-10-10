import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UserModule } from '@/module/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/module/auth/auth.module';
import { dataSourceOptions } from 'db/data-source';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from '@/module/task/task.module';
import { config } from 'config/system.config';
import {ScheduleModule} from "@nestjs/schedule";
import {BullModule} from "@nestjs/bull";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {CollectionModule} from "@/module/collection/collection.module";
import {LoggingModule} from "@/common/logging/logging.module";

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
    CollectionModule,
    LoggingModule                                    // logger
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
