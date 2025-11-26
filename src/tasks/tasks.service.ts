import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['user'] });
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }

    return task;
  }


  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.usersService.findOne(createTaskDto.userId);

    const task = this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      user,
    });

    return this.tasksRepository.save(task);
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);

    task.title = updateTaskDto.title;
    task.completed = updateTaskDto.completed;

    return this.tasksRepository.save(task);
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }

    return true;
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    const user = await this.usersService.findOne(userId);

    return this.tasksRepository.find({
      where: { user: { id: user.id } },
      relations: [],
    });
  }
}
