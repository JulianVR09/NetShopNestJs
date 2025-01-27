import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UsersModule],
  exports: [ProductsService],
  controllers: [ProductsController],
  providers: [ProductsService, AuthGuard, JwtService, CloudinaryService],
})
export class ProductsModule {}
