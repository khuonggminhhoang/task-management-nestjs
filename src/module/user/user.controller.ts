import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { UserService } from "@/module/user/user.service";
import { UpdateUserDto } from "@/module/user/dto/update-user.dto";
import { CreateUserDto } from "@/module/user/dto/create-user.dto";
import { AuthGuard} from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {UserDecorator} from "@/module/user/decorator/user.decorator";
import {FileInterceptor} from "@nestjs/platform-express";
import {AvatarValidatePipe} from "@/../validate/avatar.validate";
import {CloudinaryService} from "@/cloudinary/cloudinary.service";

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

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

    @Post('upload/avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(@UserDecorator('id', ParseIntPipe) id: number,  @UploadedFile(AvatarValidatePipe) file: Express.Multer.File) {
        const urlImage = await this.cloudinaryService.uploadImage(file);
        return this.userService.uploadAvatar(id, urlImage);
    }

}