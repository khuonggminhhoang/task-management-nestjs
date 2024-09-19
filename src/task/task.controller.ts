import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UserDecorator } from "src/user/decorator/user.decorator";
import { FindTaskDto } from "./dto/find-task.dto";
import { PaginationTaskDto } from "./dto/pagination-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Task')
@Controller('api/v1/tasks')
@UseGuards(AuthGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService ) {}

    @Get()
    findAll(@UserDecorator('id') idUser: number, @Query() findTaskDto: FindTaskDto, @Query() pagiationTaskDto: PaginationTaskDto): Promise<any> {
        return this.taskService.findAll(idUser, findTaskDto, pagiationTaskDto);
    }

    // @UseGuards(AuthGuard)
    @Get('detail/:id')
    findOne(@Param('id', ParseIntPipe) idTask: number, @UserDecorator('id') idUser: number): any {
        return this.taskService.findOne(idTask, idUser);
    }

    // @UseGuards(AuthGuard)
    @Post('create')
    create(@Body() createTask: CreateTaskDto, @UserDecorator('id') idUser: number): Promise<any> {
        return this.taskService.create(idUser, createTask);   
    }

    // @UseGuards(AuthGuard)
    @Patch('update/:id')
    update(@Param('id', ParseIntPipe) idTask: number, @Body() updateTask: UpdateTaskDto, @UserDecorator('id') idUser: number) {
        return this.taskService.update(idTask, updateTask, idUser);
    }

    // @UseGuards(AuthGuard)
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) idTask: number, @UserDecorator('id') idUser: number): Promise<any> {
        return this.taskService.delete(idTask, idUser);
    }
}
