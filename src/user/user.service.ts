import {HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/user/entities/user.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "@/user/dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import {BaseService} from "@/base/service/baseService";
import {UpdateUserDto} from "@/user/dto/update-user.dto";
import {instanceToInstance, instanceToPlain} from "class-transformer";

@Injectable()
export class UserService extends BaseService<User>{
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
    ) {
        super(userRepository);
    }

    // private method
    private async hashPassword(plaintextPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(plaintextPassword, salt);
        return password;
    }

    //----------------------//
    // public method



    async findAll(): Promise<any> {
        const users = await super.findAll({});

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved successfully",
            "data": instanceToPlain(users)
        }

    }

    async actionPreFindOne(id: number) {
        const user = await this.userRepository.findOne({ where: {id: id}});
        if(!user) {
            throw new HttpException("Not Found User", HttpStatus.NOT_FOUND);
        }

        return id;
    }

    async findOneById(id: number): Promise<any> {
        const user = await super.findOne(id);
        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved successfully",
            "data": instanceToInstance(user)
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ where: {email: email, deleted: false}});
    }

    async findOne(find: object): Promise<User> {
        return await this.userRepository.findOne({ where: find})
    }

    // update
    async actionPreUpdate(dto: UpdateUserDto) {
        return {...dto, updatedAt: new Date()};
    }

    async update(id: number, dto: UpdateUserDto): Promise<any> {
        await super.update(id, dto);
        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Resource updated successfully"
        }
    }

    async save(createUser: CreateUserDto): Promise<any> {
        return await this.userRepository.save(createUser);
    }

    async actionPreCreate(dto: CreateUserDto) {
        const password = await this.hashPassword(dto.password);
        return {...dto, password: password};
    }

    async create(dto: CreateUserDto): Promise<any> {
        const newUser = await super.create(dto);

        return {
            "success": true,
            "statusCode": HttpStatus.CREATED,
            "message": "Resource created successfully",
            "data": instanceToPlain(newUser)
        };
        
    }

    async actionPreDelete(id: number) {
        const existedUser = await this.userRepository.findOne({where: {id: id}});
        if(!existedUser) {
            throw new NotFoundException("Not found user");
        }
        return id;
    }

    async delete(id: number): Promise<any> {
        await super.delete(id);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Resource deleted successfully"
        }
    }
    
}

