/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/pagination/paginationOptions.dto';
import { PageDto } from 'src/common/pagination/responsePagination.dto';
import { Product } from 'src/entities/product.entity';
//import { User } from 'src/entities/user.entity';
import { ILike, Like, Repository } from 'typeorm';
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
  ) {}

  // async create(createProductDto: CreateProductDto) {
  //   const category = await this.categoryRepository.findOne({
  //     where: { id: createProductDto.categoryId },
  //   });
  //   if (!category) {
  //     throw new NotFoundException('Category not found');
  //   }

  //   const product = this.productRepository.create({
  //     ...createProductDto,
  //     category,
  //   });
  //   return this.productRepository.save(product);
  // }
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const product = this.productRepository.create({
        ...createProductDto,
        category,
      });
      return this.productRepository.save(product);
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
    return this.productRepository.save(product);
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
}
