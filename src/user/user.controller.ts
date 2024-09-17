import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('User')
@Controller('api/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @UseGuards(AuthGuard)
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }
    
    @Get('detail/:id')
    @UseGuards(AuthGuard)   
    findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findOneById(id);
    }

    @Patch('update/:id')
    @UseGuards(AuthGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUser: UpdateUserDto): Promise<any> {
        return this.userService.update(id, updateUser);
    }

    @UseGuards(AuthGuard)
    @Post('create')
    create(@Body() createUser: CreateUserDto): Promise<any> {
        return this.userService.create(createUser);
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard)
    delete(@Param('id',ParseIntPipe) id: number): Promise<any> {
        return this.userService.delete(id);
    }

}