import { User } from "@/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {Exclude} from "class-transformer";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

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