import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { UsersModule } from 'src/users/users.module';

import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UsersModule],
  exports: [ProductsService],
  controllers: [ProductsController],
  providers: [ProductsService, AuthGuard, JwtService, CloudinaryService],
})
export class ProductsModule {}
