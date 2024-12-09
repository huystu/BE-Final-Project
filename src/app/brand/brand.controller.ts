/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/create-brand.dto';
import { PageOptionsDto } from 'src/common/pagination/paginationOptions.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@ApiTags('product')
@UseGuards(JwtAuthGuard)
@Controller('brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) { }

    @Roles(Role.Admin, Role.Seller)
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
    @Roles(Role.Admin, Role.Seller)
    update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
        return this.brandService.update(id, updateBrandDto);
    }

    @Roles(Role.Admin, Role.Seller)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.brandService.remove(id);
    }
}