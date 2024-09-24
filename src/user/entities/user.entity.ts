import { Task } from "@/task/entities/task.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    gender: boolean;

    @Column({default: false})
    deleted: boolean;

    @Column({default: ""})
    refresh_token: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Task, (task) => task.users)
    @JoinTable()                                        // join bảng đặt bên nào cũng được
    tasks: Task[];
}