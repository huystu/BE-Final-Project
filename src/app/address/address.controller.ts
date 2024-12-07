import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from 'src/entities/address.entity';
import { CreateAddressDto } from './dto/createAddress.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.addressService.createAddress(createAddressDto);
  }
  @Get(':userId')
  async getAddresses(@Param('userId') userId: string): Promise<Address[]> {
   return this.addressService.getAddressesByUserId(userId);
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: string): Promise<void> {
    await this.addressService.deleteAddress(id);
  }
}
