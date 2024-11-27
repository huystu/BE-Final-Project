import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as sharp from 'sharp';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
    private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/'];
    //Validate
    validateFile(file: Express.Multer.File): void {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
            );
        }
    }
    async uploadImageToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
        this.validateFile(file);

        const resizedBuffer = await sharp(file.buffer)
            .jpeg({ quality: 75 })
            .toBuffer();

        const stream = Readable.from(resizedBuffer);

        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    transformation: [
                        { width: 1000, crop: 'scale' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' },
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
