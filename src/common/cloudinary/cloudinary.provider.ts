import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        const cloudName = process.env.CLOUDINARY_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        // Verifica las variables de entorno
        console.log('Cloudinary Name:', cloudName);
        console.log('Cloudinary API Key:', apiKey);
        console.log('Cloudinary API Secret:', apiSecret);

        // Configura Cloudinary
        const config = cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        // Verifica la configuración de Cloudinary
        console.log('Cloudinary Config:', config);
        
        return config;
    },
};
