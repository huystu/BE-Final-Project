import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Brand } from 'src/entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from './dto/create-brand.dto';
import { PageOptionsDto } from 'src/common/pagination/paginationOptions.dto';
import { PageDto } from 'src/common/pagination/responsePagination.dto';
import { PageMetaDto } from '../product/dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) { }

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Brand>> {
    const { name, page, take, orderBy } = pageOptionsDto;
    const skip = (page - 1) * take;
    const [result, total] = await this.brandRepository.findAndCount({
      where: {
        name: name ? Like(`%${name}%`) : undefined,
      },
      order: {
        createdAt: orderBy,
      },
      skip,
      take,
    });

    const pageMetaDto = new PageMetaDto(pageOptionsDto, total);
    return new PageDto<Brand>(result, pageMetaDto, 'Success');
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) {
      throw new NotFoundException(`Brand with ID "${id}" not found`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);
    Object.assign(brand, updateBrandDto);
    return this.brandRepository.save(brand);
  }

  async remove(id: string): Promise<void> {
    const result = await this.brandRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Brand with ID "${id}" not found`);
    }
  }
}
