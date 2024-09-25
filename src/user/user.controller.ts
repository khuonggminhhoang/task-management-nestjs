import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { User } from "@/user/entities/user.entity";
import { UpdateUserDto } from "@/user/dto/update-user.dto";
import { CreateUserDto } from "@/user/dto/create-user.dto";
import { AuthGuard} from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll(): Promise<any> {
        return this.userService.findAll({});
    }

    @Get('detail/:id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.userService.findOne(id);
    }

    @Patch('update/:id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<any> {
        return this.userService.update(id, dto);
    }

    @Post('create')
    create(@Body() dto: CreateUserDto): Promise<any> {
        return this.userService.create(dto);
    }

    @Delete('delete/:id')
    delete(@Param('id',ParseIntPipe) id: number): Promise<any> {
        return this.userService.delete(id);
    }

}