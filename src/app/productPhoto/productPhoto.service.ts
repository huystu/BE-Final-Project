import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPhoto } from 'src/entities/productPhoto.entity';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as sharp from 'sharp';
import { Readable } from 'stream';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductPhotoService {
  constructor(
    @InjectRepository(ProductPhoto)
    private readonly productPhotoRepository: Repository<ProductPhoto>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private validateFile(file: Express.Multer.File): void {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
    }
  }

  // Upload ảnh lên Cloudinary và lưu vào DB
  async uploadAndSavePhoto(
    file: Express.Multer.File,
    productId: string,
  ): Promise<ProductPhoto> {
    this.validateFile(file);

    // Resize ảnh
    const resizedBuffer = await sharp(file.buffer)
      .jpeg({ quality: 75 })
      .toBuffer();

    const stream = Readable.from(resizedBuffer);

    // Upload ảnh lên Cloudinary
    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: 'product-images' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        stream.pipe(upload);
      },
    );
    const currentProduct = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (!currentProduct) {
      throw new NotFoundException('Category not found');
    }

    console.log(currentProduct, productId);
    // Lưu thông tin ảnh vào DB
    const photo = await this.productPhotoRepository.create({
      product: { id: productId } as Product,
      url: uploadResult.secure_url,
    });

    console.log(photo);

    return await this.productPhotoRepository.save(photo);
  }

  // Upload nhiều ảnh và lưu vào DB
  async uploadAndSaveMultiplePhotos(
    files: Express.Multer.File[],
    productId: string,
  ): Promise<ProductPhoto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map((file) =>
      this.uploadAndSavePhoto(file, productId),
    );

    return Promise.all(uploadPromises);
  }


  // Upload nhiều ảnh và lưu vào DB
  async removePhotoById(
   photoId: string
  ) {
    const photo = await this.productPhotoRepository.findOne({
      where: {
        id: photoId,
      },
    });

    if (!photo) {
      throw new NotFoundException('photo not found');
    }


    return await this.productPhotoRepository.remove(photo);
  }
}
