import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
// import { MethodShippingEnum } from 'src/entities/cart.entity';

export class UpdateInformationCartDto {
  @IsString()
  @IsNotEmpty()
  cartId: string;

  // @IsEnum(MethodShippingEnum)
  // @IsNotEmpty()
  // methodShipping: MethodShippingEnum;

  @IsString()
  @IsNotEmpty()
  address: string;
}
