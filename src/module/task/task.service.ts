import {HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import { CreateTaskDto } from "@/module/task/dto/create-task.dto";
import {ILike, Repository} from "typeorm";
import { Task } from "@/module/task/entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/module/user/entities/user.entity";
import { paginationHelper } from "helper/pagination.helper";
import { UpdateTaskDto } from "@/module/task/dto/update-task.dto";
import {instanceToPlain} from "class-transformer";
import {BaseService} from "@/base/service/baseService";
import {IOption} from "@/module/task/interfaces/IOption.interface";
import {Cron} from '@nestjs/schedule';
import {EventEmitter2} from "@nestjs/event-emitter";

@Injectable()
export class TaskService extends BaseService<Task>{
    constructor(
        @InjectRepository(Task) private taskRepository: Repository<Task>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly eventEmitter: EventEmitter2
    ) {
        super(taskRepository);
    }



    // scron jobs
    @Cron('* * * * * *')
    async handleCron() {
        const tasks = await this.taskRepository.find({relations: ['users']});

        type Info = {
            task: Partial<Task>,
            ownerTask: string[]
        }

        let data: Info[] = [];
        for(let task of tasks) {
            if(!task.isNotified) {
                const time = new Date(task.time_finish).getTime() - Date.now();
                if(time < 30 * 60 * 1000) {                                                             // nếu time < 30 phút thì báo cho user
                    const _task: Partial<Task> = instanceToPlain(task);
                    const _ownerTask: string[] = task.users.map(item => item.email);
                    data.push({task: _task, ownerTask: _ownerTask});
                }
                await this.taskRepository.update({id: task.id}, {isNotified: true});
            }
        }

        // await this.taskQueue.add('name job',{content: contentTest});                     // có thể truyền name job vào để process xử lý
        this.eventEmitter.emit('task.remind', data);           // --> boolean

    }

    // @Timeout(5000)
    // handleTimeout() {
    //     console.log("Chạy time out sau 5s");
    // }
    //
    // @Interval(2000)
    // handleInterval() {
    //     console.log("Chạy inteval sau mỗi 3s");
    // }

    async actionPreFindAll(dto:Partial<Task>, option?: IOption) {
        option.keyword = option.keyword || '';
        option.order = option.order || 'ASC';
        option.sortBy = option.sortBy || 'createdAt';
        return {...option, deleted: false};
    }

    async findAll(dto:Partial<Task>, option?:IOption) {
        const handleDto = await this.actionPreFindAll(dto, option);

        const [_, countRecord] = await this.taskRepository.findAndCount({
            where: {
                deleted: false,
                created_by: handleDto.idUser
            }
        });

        const pagination = paginationHelper({ limit: handleDto.limit, page: handleDto.page}, countRecord);

        const tasks = await this.taskRepository.find({
            where: {
                deleted: false,
                created_by: handleDto.idUser,
                title: ILike(`%${handleDto.keyword}%`),
            },
            order: {
                [handleDto.sortBy]: handleDto.order
            },
            skip: pagination['skip'],
            take: pagination['limit']
        })

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved successfully",
            "data": {
                ...pagination,
                tasks: tasks
            }
        };
    }

    async actionPreCreate(dto: Partial<CreateTaskDto>) {
        let parentTask = null;
        if(dto.parentTaskId) {
            parentTask = await this.taskRepository.findOne({ where: {
                    id: dto.parentTaskId,
                    deleted: false
                }});

            if(!parentTask) {
                throw new HttpException("Not Found Parent Task", HttpStatus.NOT_FOUND);
            }
        }

        return {...dto, parentTask: parentTask};
    }

    async create(dto:Partial<Task>, option?:IOption) {
        const handleDto = await this.actionPreCreate(dto);
        const parentTask = handleDto.parentTask;
        delete handleDto.parentTask;

        const task = await this.taskRepository.create({created_by: option.idUser, ...handleDto});
        task.parentTask = parentTask;
        console.log(task);


        if( handleDto.assigned_to.length > 0) {
            for(let userId of handleDto.assigned_to) {
                const user = await this.userRepository.findOne({
                    where: {
                        id: userId,
                        deleted: false
                    }
                });
                if(!user) {
                    throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
                }

                task.users = task.users || [];
                task.users.push(user);

            }
        }

        const newTask = await this.taskRepository.save(task);

        return {
            "success": true,
            "statusCode": HttpStatus.CREATED,
            "message": "Resource created successfully",
            "data": instanceToPlain(newTask)
        }
    }

    async actionPreFindOne(idTask: number, option: IOption) {
        return {id: idTask, created_by: option.idUser, deleted: false};
    }

    async updateTask(idTask: number, dto: UpdateTaskDto, idUser: number): Promise<any> {
        const task = await this.taskRepository.findOne({
            where: {
                id: idTask,
                deleted: false,
                created_by: idUser
            },
            relations: ['users']
        });

        if(!task) {
            throw new HttpException('Not found task', HttpStatus.NOT_FOUND);
        }

        let parentTask;
        if(dto.parentTaskId) {
            parentTask = await this.taskRepository.findOne({
                where: {
                    id: dto.parentTaskId
                }
            });
        }

        task.title = dto.title ?? task.title;        // null hoặc undefined thì lấy exp2, ko thì lấy exp1
        task.status = dto.status ?? task.status;
        task.content = dto.content ?? task.content;
        task.parentTask = parentTask ?? task.parentTask;

        if(dto.assigned_to && dto.assigned_to.length > 0) {
            for( let idUser of dto.assigned_to) {
                const user = await this.userRepository.findOne({ where: {id: idUser, deleted: false}});

                if(user) {
                    task.users.push(user);
                }
            }
        }

        if(dto.removed_from && dto.removed_from.length > 0) {
            for(let idUser of dto.removed_from) {
                const user = await this.userRepository.findOne({ where: {id: idUser, deleted: false}});
                task.users = task.users.filter((item) => item.id != user.id );
            }
        }

        const update =await this.taskRepository.save(task);
        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Resource updated successfully",
            "data": update
        }
    }

    async actionPreDelete(id: number, option: IOption) {
        const task = await this.taskRepository.findOne({
            where: {
                id: id,
                deleted: false,
                created_by: option.idUser
            },
            relations: ["users"]
        });

        if (!task) {
            throw new NotFoundException("User is not allowed to delete the record")
        }

        return task;
    }

    async delete(id: number, option: IOption) {
        const task = await this.actionPreDelete(id, option);
        await this.taskRepository.remove(task);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Resource deleted successfully"
        }
    }
}