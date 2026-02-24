import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(filePath: string, folder: string = 'panditji') {
    const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
    });
    return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
