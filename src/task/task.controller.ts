import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards
} from "@nestjs/common";
import { TaskService } from "./task.service";
import  { AuthGuard} from "@nestjs/passport";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UserDecorator } from "src/user/decorator/user.decorator";
import { FindTaskDto } from "./dto/find-task.dto";
import { PaginationTaskDto } from "./dto/pagination-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Task')
@Controller('api/v1/tasks')
@UseGuards(AuthGuard('jwt'))            // cần truyền chuỗi 'jwt' vào AuthGuards để chỉ rõ chiến lược xác thực là jwt chứ không phải các chiến lược khác (oauth, facebook,...)
export class TaskController {
    constructor(private readonly taskService: TaskService ) {}

    @Get()
    findAll(@UserDecorator('id') idUser: number, @Query() findTaskDto: FindTaskDto, @Query() pagiationTaskDto: PaginationTaskDto): Promise<any> {
        // console.log(req.user); tại sao lại là .user??
        return this.taskService.findAll(idUser, findTaskDto, pagiationTaskDto);
    }

    @Get('detail/:id')
    findOne(@Param('id', ParseIntPipe) idTask: number, @UserDecorator('id') idUser: number): any {
        return this.taskService.findOne(idTask, idUser);
    }

    @Post('create')
    create(@Body() dto: CreateTaskDto, @UserDecorator('id') idUser: number): Promise<any> {
        return this.taskService.create(idUser, dto);   
    }

    @Patch('update/:id')
    update(@Param('id', ParseIntPipe) idTask: number, @Body() dto: UpdateTaskDto, @UserDecorator('id') idUser: number) {
        return this.taskService.update(idTask, dto, idUser);
    }

    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) idTask: number, @UserDecorator('id') idUser: number): Promise<any> {
        return this.taskService.delete(idTask, idUser);
    }
}
