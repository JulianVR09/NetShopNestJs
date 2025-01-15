import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BcryptService } from 'src/common/services/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly bcryptService: BcryptService
) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await this.bcryptService.hashPassword(createUserDto.password);
    const newUser = {...createUserDto, password: hashPassword }
    return await this.userRepository.save(newUser);
  }

  async findAllUser(): Promise<User[]> {
    return await this.userRepository.find(); 
  }

  async findbyUserId(id: string): Promise<User> {
    const entity = await this.userRepository.findOne({ where: { id } as any });
    if(!entity) throw new NotFoundException(`Entity with id ${id} not found`);
    return entity;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateUser = await this.userRepository.update(id, updateUserDto);

    if(!updateUser) throw new NotFoundException(`User ${id} not found`);

    const user = await this.userRepository.findOne({ where: {id}})

    if(!user) throw new NotFoundException(`User ${id} not found`);

    return user;
  }

  async remove(id: string): Promise<User> {
    const deleted = await this.userRepository.softDelete(id);

    if(deleted.affected === 0) throw new NotFoundException (`User with id ${id} not found`)

    const entityDelete = await this.userRepository.findOne({where: {id}})

    return entityDelete;
  }

  async findUserWithPassword(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'lastName', 'email', 'password', 'phoneNumber', 'role']
    })
  }
}
