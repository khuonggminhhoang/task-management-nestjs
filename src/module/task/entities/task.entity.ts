import { User } from "@/module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import {Exclude} from "class-transformer";
import {BaseEntity} from "@/base/entity/base.entity";

@Entity()
export class Task extends BaseEntity {
    @Column({ length: 100 })
    title: string;

    @Column({ default: 'initial'})
    status: string;

    @Column({ length: 255 })
    content: string;

    @CreateDateColumn()
    time_start: Date;

    @Column()
    time_finish: Date;

    @Column({ default: false})
    @Exclude()
    deleted: boolean;

    @Column()
    @Exclude()
    created_by: number;

    @Column({default: false})
    isNotified: boolean

    @OneToMany(() => Task, (task) => task.parentTask, {nullable: true})
    @Exclude()
    childTasks: Task[];

    @ManyToOne(() => Task, (task) => task.childTasks, { nullable: true, onDelete: 'CASCADE'})   // tự động xóa bản ghi là con khi task cha bị xóa
    @Exclude()
    parentTask: Task;

    @ManyToMany(() =>User, (user) => user.tasks)
    @Exclude()
    users: User[];
}