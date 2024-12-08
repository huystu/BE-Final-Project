import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/create-brand.dto';
import { PageOptionsDto } from 'src/common/pagination/paginationOptions.dto';

@Controller('brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) { }

    @Post()
    create(@Body() createBrandDto: CreateBrandDto) {
        return this.brandService.create(createBrandDto);
    }

    @Get()
    findAll(@Query() pageOptionsDto: PageOptionsDto) {
        return this.brandService.findAll(pageOptionsDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.brandService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
        return this.brandService.update(id, updateBrandDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.brandService.remove(id);
    }
}