import { Module } from "@nestjs/common";
import { UserController } from "@/user/user.controller";
import { UserService } from "@/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule {}