import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

import { CloudinaryResponse } from './cloudinary.response';

@Injectable()
export class CloudinaryService {
  async uploadFiles(
    files: Express.Multer.File[] | Express.Multer.File
  ): Promise<CloudinaryResponse[]> {
    if (!files) {
      throw new BadRequestException('No files provided.');
    }
  
    const fileArray = Array.isArray(files) ? files : [files];
    return Promise.all(fileArray.map(file => this.uploadSingleFile(file)));
  }
  
  private uploadSingleFile(
    file: Express.Multer.File
  ): Promise<CloudinaryResponse> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Invalid file or file buffer missing.');
    }

    const resourceType = this.getResourceType(file.mimetype);

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType },
        (error, result) => {
          if (error) {
            console.log('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      try {
        const readStream = streamifier.createReadStream(file.buffer);
        readStream.pipe(uploadStream);
      } catch (error) {
        reject(error);
      }
    });
  }

  private getResourceType(mimetype: string): 'image' | 'raw' {
    if (mimetype === 'application/pdf') return 'raw';
    if (mimetype.startsWith('image/')) return 'image';
    throw new BadRequestException('Unsupported file type.');
  }
}
