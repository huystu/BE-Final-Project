/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike, Like, Brackets } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductPhoto } from 'src/entities/productPhoto.entity';
import { Category } from 'src/entities/category.entity';
import { Variant } from 'src/entities/variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PageOptionsDto } from 'src/common/pagination/paginationOptions.dto';
import { PageDto } from 'src/common/pagination/responsePagination.dto';
import { PageMetaDto } from './dto';
import { FilterDto } from '../filter/dto/filter.dto';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductPhoto)
    private productPhotoRepository: Repository<ProductPhoto>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Tạo sản phẩm
    const product = this.productRepository.create({
      name: createProductDto.name,
      price: createProductDto.price,
      url: createProductDto.urls[0],
      info: createProductDto.info,
      quantity: createProductDto.quantity,
      category,
    });

    // Lưu sản phẩm vào product
    const savedProduct = await this.productRepository.save(product);

    // Tạo các đối tượng ảnh sản phẩm dựa trên danh sách URL trong createProductDto.urls và liên kết chúng với savedProduct
    const productPhotos = createProductDto.urls.map(url =>
      this.productPhotoRepository.create({ url, product: savedProduct })
    );

    await this.productPhotoRepository.save(productPhotos);

    // Tạo các biến thể Variant
    const variants = createProductDto.variants.map(variantDto =>
      this.variantRepository.create({ ...variantDto, product: savedProduct })
    );

    await this.variantRepository.save(variants);

    return this.findOne(savedProduct.id);
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id, isDelete: false },
      relations: ['category', 'photos', 'variants'],
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
    const { name, orderBy } = pageOptionsDto;

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
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
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
        category: true,
      },
    });
  }

  async findByCategory(
    categoryId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Product>> {
    const { name, orderBy } = pageOptionsDto;

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
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
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
        price: 'ASC', 
      },
    });
  }

  async getPriceBySizeAndColor(productId: string, size: string, color: string): Promise<number> {
    const variant = await this.variantRepository.findOne({
      where: { product: { id: productId }, size, color },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found for the given size and color');
    }

    return variant.price;
  }

  async filterProducts(filterDto: FilterDto): Promise<PageDto<Product>> {
    console.log('Filter DTO:', filterDto);
    const {
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      take,
      orderBy = 'DESC',
      categoryId,
      //brandId
    } = filterDto;

    const validOrder = orderBy === 'ASC' ? 'ASC' : 'DESC';

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .where('product.isDelete = :isDelete', { isDelete: false });

    if (search) {
      queryBuilder.andWhere(new Brackets(qb => {
        qb.where('LOWER(product.name::text) LIKE :search', { search: `%${search.toLowerCase()}%` })
          .orWhere('LOWER(product.info::text) LIKE :search', { search: `%${search.toLowerCase()}%` });
      }));
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    queryBuilder.orderBy('product.createdAt', validOrder);

    const pageNum = page > 0 ? page : 1;
    const pageSize = take || limit;

    queryBuilder.skip((pageNum - 1) * pageSize);
    queryBuilder.take(pageSize);

    const [result, total] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto(
      {
        page: pageNum,
        take: pageSize,
        skip: (pageNum - 1) * pageSize
      },
      total
    );

    return new PageDto<Product>(result, pageMetaDto, 'Success');
}
}
