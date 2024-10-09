import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TaskService } from "@/module/task/task.service";
import  { AuthGuard} from "@nestjs/passport";
import { CreateTaskDto } from "@/module/task/dto/create-task.dto";
import { UserDecorator } from "@/module/user/decorator/user.decorator";
import { UpdateTaskDto } from "@/module/task/dto/update-task.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {IOption} from "@/module/task/interfaces/IOption.interface";

@ApiBearerAuth()
@ApiTags('Task')
@Controller('api/v1/tasks')
@UseGuards(AuthGuard('jwt'))            // cần truyền chuỗi 'jwt' vào AuthGuards để chỉ rõ chiến lược xác thực là jwt chứ không phải các chiến lược khác (oauth, facebook,...)
export class TaskController {
    constructor(private readonly taskService: TaskService ) {}

    @Get()
    findAll(@UserDecorator('id') idUser: number, @Query() option: IOption): Promise<any> {
        // return this.taskService.findAllTask(idUser, option);
        return this.taskService.findAll({}, {...option, idUser: idUser})
    }

    @Get('detail/:id')
    findOne(@Param('id', ParseIntPipe) idTask: number, @UserDecorator('id') idUser: number): any {
        return this.taskService.findOne(idTask, {idUser: idUser});
    }

    @Post('create')
    create(@Body() dto: CreateTaskDto, @UserDecorator('id') idUser: number): Promise<any> {
        // return this.taskService.createTask(idUser, dto);
        return this.taskService.create(dto, {idUser: idUser});
    }

    @Patch('update/:id')
    update(@Param('id', ParseIntPipe) idTask: number, @Body() dto: UpdateTaskDto, @UserDecorator('id') idUser: number) {
        return this.taskService.updateTask(idTask, dto, idUser);
    }

    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) idTask: number, @UserDecorator('id') idUser: number): Promise<any> {
        return this.taskService.delete(idTask, {idUser: idUser});
    }
}
