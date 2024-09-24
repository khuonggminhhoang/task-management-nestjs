import { Module } from "@nestjs/common";
import { TaskController } from "@/task/task.controller";
import { TaskService } from "@/task/task.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "@/task/entities/task.entity";
import { User } from "@/user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Task, User])
    ],
    providers: [TaskService],
    controllers: [TaskController]
})

export class TaskModule{}
