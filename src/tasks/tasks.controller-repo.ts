import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';
import { TasksServiceRepository } from './tasks.service-repo';

@Controller('tasks-repo')
export class TasksControllerRepository {
  constructor(private readonly tasksService: TasksServiceRepository) {}

  @Get()
  getAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Task> {
    const task = await this.tasksService.findOne(Number(id));

    if (!task) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }

    return task;
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.tasksService.update(Number(id), updateTaskDto);

    if (!task) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }

    return task;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const success = await this.tasksService.delete(Number(id));

    if (!success) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }

    return { deleted: true };
  }

  @Get('user/:userId')
  getByUser(@Param('userId') userId: string): Promise<Task[]> {
    return this.tasksService.getTasksByUser(Number(userId));
  }
}
