import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from 'src/app/product/dto';


export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  readonly message: string;

  constructor(data: T[], meta: PageMetaDto, message: string) {
    this.data = data;
    this.meta = meta;
    this.message = message;
  }
}
