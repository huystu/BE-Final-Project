import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ProductPhotoService } from './productPhoto.service';

@Controller('productPhoto')
@ApiTags('productPhoto')
@UseGuards(JwtAuthGuard)
export class ProductPhotoController {
  constructor(private readonly productPhotoService: ProductPhotoService) {}
}
