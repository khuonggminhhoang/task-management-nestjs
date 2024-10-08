import {Module} from "@nestjs/common";
import {CloudinaryModule} from "@/cloudinary/cloudinary.module";
import {CollectionService} from "@/collection/collection.service";
import {CollectionController} from "@/collection/collection.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Collection} from "@/collection/entities/collection.entity";
import {User} from "@/user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Collection, User]),
        CloudinaryModule
    ],
    providers: [CollectionService],
    controllers: [CollectionController],
})

export class CollectionModule {}