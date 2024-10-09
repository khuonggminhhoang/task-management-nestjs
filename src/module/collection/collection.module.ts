import {Module} from "@nestjs/common";
import {CloudinaryModule} from "@/cloudinary/cloudinary.module";
import {CollectionService} from "@/module/collection/collection.service";
import {CollectionController} from "@/module/collection/collection.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Collection} from "@/module/collection/entities/collection.entity";
import {User} from "@/module/user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Collection, User]),
        CloudinaryModule
    ],
    providers: [CollectionService],
    controllers: [CollectionController],
})

export class CollectionModule {}