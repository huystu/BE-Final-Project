import { IsNotEmpty, IsString, IsEmail, IsUUID, Length } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @Length(10, 20)
  phone: string; // Số điện thoại

  @IsNotEmpty()
  @IsEmail()
  email: string; // Email

  @IsNotEmpty()
  @Length(2, 255)
  recipientName: string; // Tên người nhận

  @IsNotEmpty()
  @Length(2, 100)
  city: string; // Thành phố

  @IsNotEmpty()
  @Length(2, 100)
  province: string; // Tỉnh

  @IsNotEmpty()
  @Length(2, 100)
  district: string; // Quận, huyện

  @IsNotEmpty()
  @Length(2, 100)
  ward: string; // Phường

  @IsNotEmpty()
  @Length(2, 255)
  detailedAddress: string; // Địa chỉ chi tiết

  @IsNotEmpty()
  @IsUUID()
  userId: string; // ID người dùng liên kết
}
