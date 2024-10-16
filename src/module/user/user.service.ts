import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/module/user/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "@/module/user/dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import {BaseService} from "@/base/service/baseService";
import {UpdateUserDto} from "@/module/user/dto/update-user.dto";


@Injectable()
export class UserService extends BaseService<User>{
    private logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super(userRepository);
    }

    // private method
    public async hashPassword(plaintextPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(plaintextPassword, salt);
        return password;
    }

    // find all user ở baseService có rồi
    async actionPreFindAll({}) {
        this.logger.log("tesst error", "hehe");
        return {deleted: false};
    }

    // Read detail, chỉ cần override hàm pre của base service, hàm findOne ở baseService có rồi
    async actionPreFindOne(id: number) {
        const user = await this.userRepository.findOne({ where: {id: id}});
        if(!user) {
            throw new HttpException("Not Found User", HttpStatus.NOT_FOUND);
        }

        return id;
    }

    // update, tương tự
    async actionPreUpdate(dto: UpdateUserDto) {
        return {...dto, updatedAt: new Date()};
    }

    // create, tương tự
    async actionPreCreate(dto: CreateUserDto) {
        const password = await this.hashPassword(dto.password);
        return {...dto, password: password};
    }

    // delete, tương tự
    async actionPreDelete(id: number) {
        const existedUser = await this.userRepository.findOne({where: {id: id}});
        if(!existedUser) {
            throw new NotFoundException("Not found user");
        }
        return id;
    }

    // gen function
    async findOneElement(find: object): Promise<User> {
        return await this.userRepository.findOne({ where: find});
    }

    async save(createUser: CreateUserDto): Promise<any> {
        return await this.userRepository.save(createUser);
    }

    // upload avatar
    async uploadAvatar(id: number, urlImage: string) {
        await this.userRepository.update({id: id}, {avatar: urlImage});

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "upload avatar successfully",
            "data": {
                img: urlImage
            }
        }
    }
}