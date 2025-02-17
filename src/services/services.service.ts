import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { Role } from '../common/enums/role.enum';
import { ActiveUserInterface } from '../common/interface/activeUser.interface';
import { UsersService } from '../users/users.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly userService: UsersService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  private async patchRole(user: ActiveUserInterface) {
    user.role = Role.SERVICEPROVIDER;
    await this.userService.updateUserRole(user.id, Role.SERVICEPROVIDER);
  }

  async createService(
    createServiceDto: CreateServiceDto,
    user: ActiveUserInterface,
    files: Express.Multer.File[]
  ): Promise<Service> {
    try {
      if (!files || files.length === 0) {
        throw new Error('El archivo es requerido para crear el servicio.');
      }

      const uploadResults = await this.cloudinaryService.uploadFiles(files);

      const imageResult = uploadResults.find(result => result.resource_type === 'image');
      createServiceDto.image = imageResult ? imageResult.secure_url : '';

      const pdfResult = uploadResults.find(result => result.resource_type === 'raw');
      createServiceDto.HV = pdfResult ? pdfResult.secure_url : '';

      const service = this.serviceRepository.create({
        ...createServiceDto,
        user: {id: user.id}
      });

      return await this.serviceRepository.save(service)
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw new Error('No se pudo crear el producto.');
  }

}

  async findServiceById(id: string): Promise<Service> {
    return await this.serviceRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    files: Express.Multer.File[]
  ): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
  
    if (!service) throw new Error('Service not found');
  
    if (files && files.length > 0) {
      const uploadResults = await this.cloudinaryService.uploadFiles(files);
  
      
      const imageResult = uploadResults.find(result => result.resource_type === 'image');
      const pdfResult = uploadResults.find(result => result.resource_type === 'raw');
  
      if (imageResult) {
        updateServiceDto.image = imageResult.secure_url;
      }
  
      if (pdfResult) {
        updateServiceDto.HV = pdfResult.secure_url;
      }
    }
  
    Object.assign(service, updateServiceDto);
  
    return await this.serviceRepository.save(service);
  }
  

  async removeService(id: string): Promise<void> {
    const service = await this.serviceRepository.findOne({ where: {id} });

    if(!service) {
      throw new NotFoundException(`The service with id ${id} not found`);
    }

    await this.serviceRepository.remove(service)
  }
}
