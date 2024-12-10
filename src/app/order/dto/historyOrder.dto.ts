import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetHistoryOrdersDto {
  @ApiProperty({})
  @IsUUID('4', { message: 'userId phải là UUID hợp lệ' })
  userId: string;
}
