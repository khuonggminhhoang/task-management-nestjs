import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    deleted: boolean;

    @Column()
    created_by: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Task, (task) => task.parentTask, {nullable: true})
    childTasks: Task[];

    @ManyToOne(() => Task, (task) => task.childTasks, { nullable: true, onDelete: 'CASCADE'})   // tự động xóa bản ghi là con khi task cha bị xóa
    parentTask: Task;

    @ManyToMany(() =>User, (user) => user.tasks)
    users: User[];
}