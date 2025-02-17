import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { Category } from 'src/common/enums/categories.enum';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUserInterface } from 'src/common/interface/activeUser.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UsersService
  ) {}

  private async patchRole(user: ActiveUserInterface) {
    user.role = Role.SELLER;
    await this.userService.updateUserRole(user.id, Role.SELLER);
  }

  async createProduct(
    createProductDto: CreateProductDto,
    user: ActiveUserInterface,
    file: Express.Multer.File
  ): Promise<Product> {
    try {
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFiles(file);
        const uploadData = Array.isArray(uploadResult) ? uploadResult [0] : uploadResult;
        createProductDto.image = uploadData.secure_url;
      } else {
        throw new Error('El archivo es requerido para crear el producto.');
      }

      const product = this.productRepository.create({
        ...createProductDto,
        user: { id: user.id },
      });

      await this.patchRole(user);

      return await this.productRepository.save(product);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw new Error('No se pudo crear el producto.');
    }
  }

  async findProductById(id: string): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async findAllProductsCategory(): Promise<{ [key: string]: Product[] }> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .select(['product', 'product.category'])
      .getMany();

    const products = await query;
    const result: { [key: string]: Product[] } = {};

    for (const category in Category) {
      if (isNaN(Number(category))) {
        result[category] = products.filter(
          (product) =>
            product.category === Category[category as keyof typeof Category]
        );
      }
    }
    return result;
  }

  async updatedProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) throw new Error('Product not found');

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFiles(file);
      const uploadData = Array.isArray(uploadResult) ? uploadResult [0] : uploadResult;
      updateProductDto.image = uploadData.secure_url;
    }

    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productRepository.remove(product);
  }
}
