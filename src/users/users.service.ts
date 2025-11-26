import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
     @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(newUser);
  }



  async deleteUser(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete(id);

    return result.affected === 1;
  }


   async addRoleToUser(userId: number, roleName: string): Promise<Role> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) throw new Error('User not found');

    let role = await this.rolesRepository.findOne({ where: { name: roleName } });
    if (!role) {
      role = this.rolesRepository.create({ name: roleName });
      await this.rolesRepository.save(role);
    }

    if (!user.roles) user.roles = [];
    user.roles.push(role);
    await this.usersRepository.save(user);

    return role;
  }

async findByUsername(username: string): Promise<User | null> {
  return this.usersRepository.findOne({
    where: { username },
    relations: ['roles'],
  });
}



}

