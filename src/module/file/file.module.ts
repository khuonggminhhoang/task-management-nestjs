import {Module} from "@nestjs/common";
import {FileController} from "@/module/file/file.controller";
import {FileService} from "@/module/file/file.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@/module/user/entities/user.entity";
import {UserModule} from "@/module/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UserModule
    ],
    controllers: [FileController],
    providers: [FileService]
})

export class FileModule{}
