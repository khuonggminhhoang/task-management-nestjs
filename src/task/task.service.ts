import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Repository } from "typeorm";
import { Task } from "./entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { FindTaskDto } from "./dto/find-task.dto";
import { PaginationTaskDto } from "./dto/pagination-task.dto";
import { paginationHelper } from "helper/pagination.helper";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task) private taskRepository: Repository<Task>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async findAll(idUser: number, findTaskDto: FindTaskDto, paginationTaskDto: PaginationTaskDto): Promise<any> {
        findTaskDto.keyword = findTaskDto.keyword || '';
        findTaskDto.order = findTaskDto.order || 'ASC';
        findTaskDto.sortBy = findTaskDto.sortBy || 'createdAt';
        
        const [_, countRecord] = await this.taskRepository.findAndCount({
            where: {
                deleted: false,
                created_by: idUser
            }
        });

        const pagination = paginationHelper(paginationTaskDto, countRecord);
        
        try {
            const tasks = await this.taskRepository
                            .createQueryBuilder('task')
                            .where('deleted = :deleted', { deleted: false })
                            .andWhere('created_by = :idUser', { idUser })
                            .andWhere(`LOWER(title) LIKE LOWER(:keyword)`, { keyword: `%${findTaskDto.keyword}%` })
                            .orderBy( findTaskDto.sortBy, findTaskDto.order)
                            .skip(pagination['skip'])
                            .take(pagination['limit'])          // không dùng limit vì nó chỉ lấy ra n bản ghi từ đầu db thôi
                            .getMany();

            return {
                ...pagination,
                data: tasks
            };
        }
        catch(err) {
            throw new NotFoundException();
        }
        
    }

    async create(idUser: number, createTask: CreateTaskDto): Promise<any> {
        try {
            let parentTask = null;

            if(createTask.parentTaskId) {
                parentTask = await this.taskRepository.findOne({ where: {
                    id: createTask.parentTaskId,
                    deleted: false
                }});
    
                if(!parentTask) {
                    throw new HttpException("Not Found Parent Task", HttpStatus.NOT_FOUND);
                }
            }
            
            const task = await this.taskRepository.create({...createTask, created_by: idUser});
            task.parentTask = parentTask != null ? parentTask : null;

            // khai báo mảng ban đầu cho task.users vì Mảng task.users không được khởi tạo khi tạo một task mới bằng this.taskRepository.create(), vì mối quan hệ ManyToMany giữa Task và User chỉ được thiết lập sau khi lưu task vào cơ sở dữ liệu.
            if( createTask.assigned_to.length > 0) {
                for(let userId of createTask.assigned_to) {
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

            return this.taskRepository.save(task);
            
        }
        catch (err){
            if(err instanceof HttpException) {
                return err;
            }
            throw new BadRequestException(); 
        }
        
    }

    async findOne(idTask: number, idUser: number): Promise<any> {
        try {
            const task = await this.taskRepository.findOne({
                select: ['id', 'title', 'status', 'content', 'time_start', 'time_finish', 'createdAt', 'updatedAt', 'parentTask'],
                where: {
                    id: idTask,
                    deleted: false,
                    created_by: idUser
                }
            });

            return task;
        }
        catch(err) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
    }

    async update(idTask: number, updateTask: UpdateTaskDto, idUser: number): Promise<any> {
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
        if(updateTask.parentTaskId) {
            parentTask = await this.taskRepository.findOne({
                where: {
                    id: updateTask.parentTaskId
                }
            });
        }        

        task.title = updateTask.title ?? task.title;        // null hoặc undefined thì lấy exp2, ko thì lấy exp1 
        task.status = updateTask.status ?? task.status;
        task.content = updateTask.content ?? task.content;
        task.parentTask = parentTask ?? task.parentTask;
        
        if(updateTask.assigned_to && updateTask.assigned_to.length > 0) {
            for( let idUser of updateTask.assigned_to) {
                const user = await this.userRepository.findOne({ where: {id: idUser, deleted: false}});
                task.users.push(user);
            }
        }

        if(updateTask.removed_from && updateTask.removed_from.length > 0) {
            for(let idUser of updateTask.removed_from) {
                const user = await this.userRepository.findOne({ where: {id: idUser, deleted: false}});
                task.users = task.users.filter((item) => item.id != user.id );
            }
        }
        
        const update =await this.taskRepository.save(task);
        return update;
    }

    async delete(idTask: number, idUser: number): Promise<any> {
        try {
            const task = await this.taskRepository.findOne({
                where: {
                    id: idTask,
                    deleted: false,
                    created_by: idUser
                },
                relations: ['users']
            });
            
            return await this.taskRepository.remove(task);
        }
        catch(err) {
            throw new BadRequestException();
        }
    }
}