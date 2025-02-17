import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interface/activeUser.interface';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('Services')
@UseGuards(AuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 2))
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @ActiveUser() user: ActiveUserInterface,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    if (!files || files.length === 0) {
      throw new Error('Debe proporcionar un archivo para la foto');
    }

    return this.servicesService.createService(createServiceDto, user, files);
  }

  @Get()
  async getServiceById(id: string) {
    return this.servicesService.findServiceById(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 2))
  async updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.servicesService.update(id, updateServiceDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.removeService(id);
  }
}
