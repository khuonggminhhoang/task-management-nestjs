import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Exclude} from "class-transformer";

export class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({default: false})
    deleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}