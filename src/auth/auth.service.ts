import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      username,
      email,
      password: hashedPassword,
    });


    const defaultRole = await this.usersService.addRoleToUser(user.id, 'user');
    user.roles = [defaultRole];
    return user;
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password && await bcrypt.compare(password, user.password)) {
  const { password, ...result } = user;
  return result;
}
return null;

  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, roles: user.roles.map(r => r.name) };
    return { access_token: this.jwtService.sign(payload) };
  }
}
