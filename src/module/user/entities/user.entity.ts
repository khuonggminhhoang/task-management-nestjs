import { Task } from "@/module/task/entities/task.entity";
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
} from "typeorm";
import {Exclude} from "class-transformer";
import {BaseEntity} from "@/base/entity/base.entity";
import {Collection} from "@/module/collection/entities/collection.entity";

@Entity()
export class User extends BaseEntity{
    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column({nullable: true, default: null})
    avatar: string;

    @Exclude()
    @Column()
    password: string;

    @Column({nullable: true})
    gender: boolean;

    @Exclude()
    @Column({default: ""})
    refresh_token: string

    @ManyToMany(() => Task, (task) => task.users)
    @JoinTable()                                        // join bảng đặt bên nào cũng được
    tasks: Task[];

    @OneToMany(() => Collection, (collection) => collection.user)
    @Exclude()
    collections: Collection[]
}