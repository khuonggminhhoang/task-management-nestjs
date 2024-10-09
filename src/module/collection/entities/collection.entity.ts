import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "@/base/entity/base.entity";
import {User} from "@/module/user/entities/user.entity";
import {Exclude} from "class-transformer";

@Entity()
export class Collection extends BaseEntity {
    @Column({nullable: true, default: null})
    url: string

    @ManyToOne(() => User, (user) => user.collections)
    @Exclude()
    user: User
}