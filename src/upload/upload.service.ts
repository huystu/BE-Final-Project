import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as sharp from 'sharp';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  async uploadImageToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const resizedBuffer = await sharp(file.buffer)
      .jpeg({ quality: 75 }) 
      .toBuffer();

    const stream = Readable.from(resizedBuffer);

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          transformation: [
            { width: 1000, crop: 'scale' }, // Resize to width 1000px
            { quality: 'auto' },            // Optimize image quality automatically
            { fetch_format: 'auto' },       // Deliver in the most optimized format
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      stream.pipe(upload);
    });
  }
}
