import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "@/task/dto/create-task.dto";
import { Repository } from "typeorm";
import { Task } from "@/task/entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/user/entities/user.entity";
import { paginationHelper } from "helper/pagination.helper";
import { UpdateTaskDto } from "@/task/dto/update-task.dto";
import {instanceToPlain} from "class-transformer";
import {OptionTaskDto} from "@/task/dto/option-task.dto";

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task) private taskRepository: Repository<Task>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async findAllTask(idUser: number,dto: OptionTaskDto) {
        dto.keyword = dto.keyword || '';
        dto.order = dto.order || 'ASC';
        dto.sortBy = dto.sortBy || 'createdAt';

        const [_, countRecord] = await this.taskRepository.findAndCount({
            where: {
                deleted: false,
                created_by: idUser
            }
        });

        const pagination = paginationHelper({ limit: dto.limit, page: dto.page}, countRecord);

        const tasks = await this.taskRepository
            .createQueryBuilder('task')
            .where('deleted = :deleted', { deleted: false })
            .andWhere('created_by = :idUser', { idUser: idUser })
            .andWhere(`LOWER(title) LIKE LOWER(:keyword)`, { keyword: `%${dto.keyword}%` })
            .orderBy( dto.sortBy, dto.order)
            .skip(pagination['skip'])
            .take(pagination['limit'])          // không dùng limit vì nó chỉ lấy ra n bản ghi từ đầu db thôi
            .getMany();

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

    async createTask(idUser: number, dto: CreateTaskDto): Promise<any> {
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


        const task = this.taskRepository.create({...dto, created_by: idUser});
        task.parentTask = parentTask != null ? parentTask : null;

        // khai báo mảng ban đầu cho task.users vì Mảng task.users không được khởi tạo khi tạo một task mới bằng this.taskRepository.create(), vì mối quan hệ ManyToMany giữa Task và User chỉ được thiết lập sau khi lưu task vào cơ sở dữ liệu.
        if( dto.assigned_to.length > 0) {
            for(let userId of dto.assigned_to) {
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
            "data": newTask
        }

    }

    async findOne({idTask, idUser}): Promise<any> {
        const task = await this.taskRepository.findOne({
            where: {
                id: idTask,
                deleted: false,
                created_by: idUser
            }
        });

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved successfully",
            "data": instanceToPlain(task)
        }
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

    async deleteTask(idTask: number, idUser: number): Promise<any> {
        const task = await this.taskRepository.findOne({
            where: {
                id: idTask,
                deleted: false,
                created_by: idUser
            },
            relations: ['users']
        });

        if (!task) {
            throw new NotFoundException("User is not allowed to delete the record")
        }

        await this.taskRepository.remove(task);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Resource deleted successfully"
        }
    }
}