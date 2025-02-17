import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userTokenPayload } from 'src/common/interface/userTokenPayload.interface';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService
  ) {}

  private generateToken(user: userTokenPayload): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async registerUser(registerDto: RegisterDto): Promise<RegisterDto> {
    return this.userService.createUser(registerDto);
  }

  async loginUser({ email, password }: LoginDto) {
    const findUser = await this.userService.findUserWithPassword(email);

    if (!findUser) throw new UnauthorizedException(`User ${email} not found`);

    const isMatch = await this.bcryptService.comparePasswords(
      password,
      findUser.password
    );

    if (!isMatch) throw new UnauthorizedException('invalid password');

    const accessToken = this.generateToken(findUser);
    return {
      accessToken,
      user: {
        id: findUser.id,
        name: findUser.name,
        lastName: findUser.lastName,
        email: findUser.email,
        role: findUser.role,
      },
    };
  }

  async findAllUser(): Promise<User[]> {
    return await this.userService.findAllUser();
  }
}
