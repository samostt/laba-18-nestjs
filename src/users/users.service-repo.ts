import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersServiceRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['tasks'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!user) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return user;
  }

  create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);

    return this.usersRepository.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete(id);

    return result.affected === 1;
  }
}
