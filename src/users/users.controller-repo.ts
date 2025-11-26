import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersServiceRepository } from './users.service-repo';

@Controller('users-repo')
export class UsersControllerRepository {
  constructor(private readonly usersService: UsersServiceRepository) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(Number(id));

    if (!user) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return user;
  }

  @Post()
  create(@Body() data: Partial<User>): Promise<User> {
    return this.usersService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const success = await this.usersService.delete(Number(id));

    if (!success) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return { deleted: true };
  }
}
