import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { OrderBy } from '../enum/orderBy.enum';
import { Type } from 'class-transformer';
export class PageOptionsDto {
  @ApiPropertyOptional({ enum: OrderBy, default: OrderBy.ASC })
  @IsEnum(OrderBy)
  @IsOptional()
  readonly orderBy?: OrderBy = OrderBy.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly name?: string = '';

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
