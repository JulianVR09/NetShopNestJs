import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interface/activeUser.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Products')
@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createProduct(@Body() createProductDto: CreateProductDto, @ActiveUser() user: ActiveUserInterface, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
        throw new Error('Debe proporcionar un archivo para la imagen del producto.');
    }

    return this.productsService.createProduct(createProductDto, user, file);
  }

  @Get('by-category')
  async getProductByCategory(){
    return this.productsService.findAllProductsCategory();
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: Express.Multer.File){
    return this.productsService.updatedProduct(id, updateProductDto, file);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string){
    return this.productsService.deleteProduct(id);
  }
}
