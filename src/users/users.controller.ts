import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(user => ({
      id: user.id,
      name: user.username,
    }));
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(Number(id));

    if (!user) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return {
      id: user.id,
      name: user.username,
    };
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(createUserDto);
    return {
      id: user.id,
      name: user.username,
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const success = await this.usersService.deleteUser(Number(id));

    if (!success) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return { deleted: true };
  }
}
