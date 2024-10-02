import { Module } from "@nestjs/common";
import { TaskController } from "@/task/task.controller";
import { TaskService } from "@/task/task.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "@/task/entities/task.entity";
import { User } from "@/user/entities/user.entity";
import {MailModule} from "@/common/mail/mail.module";
import {BullModule} from "@nestjs/bull";
import {TaskProcessor} from "@/task/process/task-queue.process";
import {TaskRemindListener} from "@/task/listeners/task-remind.listener";

@Module({
    imports: [
        TypeOrmModule.forFeature([Task, User]),
        BullModule.registerQueue({
            name: 'task'
        }),
        MailModule
    ],
    providers: [TaskService, TaskProcessor, TaskRemindListener],
    controllers: [TaskController]
})

export class TaskModule{}