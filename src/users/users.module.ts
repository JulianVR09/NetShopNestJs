import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BcryptService } from 'src/common/services/bcrypt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [],
  providers: [UsersService, BcryptService],
  exports: [UsersService]
})
export class UsersModule {}
