import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TaskService } from "@/task/task.service";
import  { AuthGuard} from "@nestjs/passport";
import { CreateTaskDto } from "@/task/dto/create-task.dto";
import { UserDecorator } from "@/user/decorator/user.decorator";
import { OptionTaskDto } from "@/task/dto/option-task.dto";
import { UpdateTaskDto } from "@/task/dto/update-task.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Task')
@Controller('api/v1/tasks')
@UseGuards(AuthGuard('jwt'))            // cần truyền chuỗi 'jwt' vào AuthGuards để chỉ rõ chiến lược xác thực là jwt chứ không phải các chiến lược khác (oauth, facebook,...)
export class TaskController {
    constructor(private readonly taskService: TaskService ) {}

    @Get()
    findAll(@UserDecorator('id') idUser: number, @Query() dto: OptionTaskDto): Promise<any> {
        return this.taskService.findAllTask(idUser, dto);
    }

    @Get('detail/:id')
    findOne(@Param('id', ParseIntPipe) idTask: number, @UserDecorator('id') idUser: number): any {
        return this.taskService.findOne({idTask, idUser});
    }

    @Post('create')
    create(@Body() dto: CreateTaskDto, @UserDecorator('id') idUser: number): Promise<any> {
        return this.taskService.createTask(idUser, dto);
    }

    @Patch('update/:id')
    update(@Param('id', ParseIntPipe) idTask: number, @Body() dto: UpdateTaskDto, @UserDecorator('id') idUser: number) {
        return this.taskService.updateTask(idTask, dto, idUser);
    }

    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) idTask: number, @UserDecorator('id') idUser: number): Promise<any> {
        return this.taskService.deleteTask(idTask, idUser);
    }
}
