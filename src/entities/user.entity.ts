// src/entities/user.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Task } from './task.entity';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];

  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles: Role[];
}
