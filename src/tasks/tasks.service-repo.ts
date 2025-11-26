import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksServiceRepository {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.usersRepository.findOne({
      where: { id: createTaskDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id=${createTaskDto.userId} not found`,
      );
    }

    const task = this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      user,
    });

    return this.tasksRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    task.title = updateTaskDto.title;
    task.completed = updateTaskDto.completed;

    return this.tasksRepository.save(task);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.tasksRepository.delete(id);

    return result.affected === 1;
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
