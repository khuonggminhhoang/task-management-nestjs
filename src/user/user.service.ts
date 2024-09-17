import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
    ) {}

    // private method
    private async hashPassword(plaintextPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(plaintextPassword, salt);
        return password;
    }

    // public method
    async findAll(): Promise<User[]> {
        return await this.userRepository.find({
            select: ['id', 'full_name', 'email', 'gender', 'createdAt', 'updatedAt']
        });
    }

    async findOneById(id: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: {id: id}});
            if(!user) {
                throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
            }
            return user
        } catch(error) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ where: {email: email, deleted: false}});
    }

    async findOne(find: object): Promise<User> {
        return await this.userRepository.findOne({ where: find})
    }

    async update(id: number, updateUser: any): Promise<UpdateResult> {
        try {
            return await this.userRepository.update({id: id}, {...updateUser, updatedAt: new Date()});
        }   
        catch {
            throw new InternalServerErrorException();
        }
    }

    async save(createUser: CreateUserDto): Promise<any> {
        return await this.userRepository.save(createUser);
    }

    async create(createUser: CreateUserDto): Promise<User> {
        try {
            const password = await this.hashPassword(createUser.password);
            const newUser = await this.userRepository.save({...createUser, password: password});
            return newUser;
        }
        catch(err) {
            throw new HttpException("Create user failed", HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        try {
            return this.userRepository.update({id: id}, {deleted: true});
        }
        catch {
            throw new HttpException("Delete user failed", HttpStatus.BAD_REQUEST);
        }
    }
    
}

