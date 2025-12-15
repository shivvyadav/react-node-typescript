import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';

// --- Cloudinary Config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// --- Safe delete helper ---
const safeUnlink = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting temp file:', error);
  }
};

// --- Upload Function (Fully TypeScript Safe) ---
export const uploadOnCloudinary = async (
  localFilePath: string,
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // Delete local temp file after upload
    safeUnlink(localFilePath);

    return response;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Delete file even if upload fails
    safeUnlink(localFilePath);
    return null;
  }
};
