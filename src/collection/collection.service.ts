import {HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Collection} from "@/collection/entities/collection.entity";
import {Repository} from "typeorm";
import {User} from "@/user/entities/user.entity";
import {instanceToPlain} from "class-transformer";

@Injectable()
export class CollectionService {
    constructor(
        @InjectRepository(Collection) private collectionRepository: Repository<Collection>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async uploadMultiImage(idUser: number, urls: string[]) {
        const data = [];
        for(let url of urls) {
            const collection = this.collectionRepository.create({url: url});
            collection.user = await this.userRepository.findOneBy({id: idUser});

            await this.collectionRepository.save(collection);
            data.push(instanceToPlain(collection));
        }

        return {
            "success": true,
            "statusCode": HttpStatus.CREATED,
            "message": "Resource created successfully",
            "data": data
        }
    }


}