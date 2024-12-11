/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike, Like, Brackets } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductPhoto } from 'src/entities/productPhoto.entity';
import { Category } from 'src/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PageOptionsDto } from 'src/common/pagination/paginationOptions.dto';
import { PageDto } from 'src/common/pagination/responsePagination.dto';
import { PageMetaDto } from './dto';
import { FilterDto } from '../filter/dto/filter.dto';
import { ProductPhotoService } from '../productPhoto/productPhoto.service';
import { Brand } from 'src/entities/brand.entity';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductPhoto)
    private productPhotoRepository: Repository<ProductPhoto>,

    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,

    private readonly productPhotoService: ProductPhotoService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    // files: Express.Multer.File[],
  ): Promise<Product> {
    const {
      name,
      price,
      description,
      quantity,
      categoryId,
      color,
      size,
      urls,
      brandId,
    } = createProductDto;

    // Kiểm tra danh mục
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const brand = await this.brandRepository.findOne({
      where: {
        id: brandId,
      },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const product = this.productRepository.create({
      name,
      price,
      description,
      urls,
      quantity,
      category,
      brand,
      color,
      size,
    });
    const savedProduct = await this.productRepository.save(product);

    // if (files && files.length > 0) {
    //   await this.productPhotoService.uploadAndSaveMultiplePhotos(
    //     files,
    //     savedProduct.id,
    //   );
    // }

    return this.findOne(savedProduct.id);
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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    // files: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    // if (files && files.length > 0) {
    //   await this.productPhotoService.uploadAndSaveMultiplePhotos(files, id);
    // }

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
    await this.productRepository.save(product);
    return this.findOne(product.id);
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

  // async getPriceBySizeAndColor(
  //   productId: string,
  //   size: string,
  //   color: string,
  // ): Promise<number> {
  //   const variant = await this.variantRepository.findOne({
  //     where: { product: { id: productId }, size, color },
  //   });

  //   if (!variant) {
  //     throw new NotFoundException(
  //       'Variant not found for the given size and color',
  //     );
  //   }

  //   return variant.price;
  // }

  async filterProducts(filterDto: FilterDto): Promise<PageDto<Product>> {
    const {
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      take,
      orderBy = 'DESC',
      categoryId = [],
      // brandId= [],
    } = filterDto;

    const validOrder = orderBy === 'ASC' ? 'ASC' : 'DESC';

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.photos', 'photos')
      .where('product.isDelete = :isDelete', { isDelete: false });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(product.name::text) LIKE :search', {
            search: `%${search.toLowerCase()}%`,
          }).orWhere('LOWER(product.info::text) LIKE :search', {
            search: `%${search.toLowerCase()}%`,
          });
        }),
      );
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    }

    if (categoryId.length > 0) {
      queryBuilder.andWhere('category.id IN (:...categoryId)', { categoryId });
    }

    // if (brandId.length > 0) {
    //   queryBuilder.andWhere('brand.id IN (:...brandId)', { brandId });
    // }

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
        skip: (pageNum - 1) * pageSize,
      },
      total,
    );

    return new PageDto<Product>(result, pageMetaDto, 'Success');
  }
}
