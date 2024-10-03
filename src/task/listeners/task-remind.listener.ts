import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {Task} from "@/task/entities/task.entity";

@Injectable()
export class TaskRemindListener {
    constructor(@InjectQueue('task') private taskQueue: Queue) {}

    @OnEvent('task.remind')
    async handleTaskRemindEvent(data: {task: Partial<Task>, ownerTask: string[]}[]) {

        // Đoạn này đẩy vào data queue
        for(let {task, ownerTask} of data) {
            for(let email of ownerTask) {
                await this.taskQueue.add({task: task, email: email});
            }
        }


    }
}