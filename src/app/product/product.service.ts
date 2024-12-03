import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/pagination/paginationOptions.dto';
import { PageDto } from 'src/common/pagination/responsePagination.dto';
import { Product } from 'src/entities/product.entity';
import { ProductPhoto } from 'src/entities/productPhoto.entity';
import { Between, ILike, Like, Repository } from 'typeorm';
import { PageMetaDto } from './dto';
import { Category } from 'src/entities/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductPhoto)
    private productPhotoRepository: Repository<ProductPhoto>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const product = this.productRepository.create({
        name: createProductDto.name,
        price: createProductDto.price,
        url: createProductDto.urls[0], // Giữ lại url ban đầu để tương thích
        info: createProductDto.info,
        quantity: createProductDto.quantity,
        category,
      });

      const savedProduct = await this.productRepository.save(product);

      const productPhotos = createProductDto.urls.map(url => 
        this.productPhotoRepository.create({ 
          url, 
          product: savedProduct 
        })
      );

      await this.productPhotoRepository.save(productPhotos);

      // Tải lại sản phẩm để bao gồm ảnh
      return this.findOne(savedProduct.id);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Internal server error');
    }
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id, isDelete: false },
      relations: ['category', 'photos'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    product.isDelete = true;
    return await this.productRepository.save(product);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    const { name, page, take, orderBy } = pageOptionsDto;
    const takeData = take || 10;
    const skip: number = (page - 1) * take;
    const [result, total] = await this.productRepository.findAndCount({
      where: {
        name: name ? ILike(`%${name.toLowerCase()}%`) : Like(`%%`),
        isDelete: false,
      },
      relations: {
        photos: true,
        category: true,
      },
      order: {
        createdAt: orderBy,
      },
      skip: skip,
      take: takeData,
    });
    const pageMetaDto = new PageMetaDto(pageOptionsDto, total);
    return new PageDto<Product>(result, pageMetaDto, 'Success');
  }

  async findById(id: string): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        photos: true,
      },
    });
  }

  async findByCategory(categoryId: string, pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    const { name, page, take, orderBy } = pageOptionsDto;
    const takeData = take || 10;
    const skip: number = (page - 1) * take;
  
    const [result, total] = await this.productRepository.findAndCount({
      where: {
        category: { id: categoryId },
        name: name ? ILike(`%${name.toLowerCase()}%`) : Like(`%%`),
        isDelete: false,
      },
      relations: {
        photos: true,
        category: true,
      },
      order: {
        createdAt: orderBy,
      },
      skip: skip,
      take: takeData,
    });
  
    const pageMetaDto = new PageMetaDto(pageOptionsDto, total);
    return new PageDto<Product>(result, pageMetaDto, 'Success');
  }

  async filterByPrice(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        price: Between(minPrice, maxPrice),
        isDelete: false,
      },
      order: {
        price: 'ASC', // Sắp xếp tăng dần
      },
    });
  }
  
}