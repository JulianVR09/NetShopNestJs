import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { UsersModule } from 'src/users/users.module';

import { Service } from './entities/service.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), UsersModule],
  exports: [ServicesService],
  controllers: [ServicesController],
  providers: [ServicesService, AuthGuard, JwtService, CloudinaryService],
})
export class ServicesModule {}
