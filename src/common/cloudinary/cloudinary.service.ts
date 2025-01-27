import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
        if (!file || !file.buffer) {
            throw new BadRequestException('Invalid file or file buffer missing.');
        }

        // Verifica el archivo recibido
        console.log('File received:', file.originalname);
        console.log('File size:', file.size);
        console.log('File buffer:', file.buffer.slice(0, 20)); // Muestra solo los primeros bytes para evitar loguear demasiado contenido

        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
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
}
