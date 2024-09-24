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

    // @UseGuards(AuthGuard)
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('detail/:id')
    // @UseGuards(AuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findOneById(id);
    }

    @Patch('update/:id')
    // @UseGuards(AuthGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUser: UpdateUserDto): Promise<any> {
        return this.userService.update(id, updateUser);
    }

    // @UseGuards(AuthGuard)
    @Post('create')
    create(@Body() createUser: CreateUserDto): Promise<any> {
        return this.userService.create(createUser);
    }

    @Delete('delete/:id')
    // @UseGuards(AuthGuard)
    delete(@Param('id',ParseIntPipe) id: number): Promise<any> {
        return this.userService.delete(id);
    }

}