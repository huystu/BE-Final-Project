import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'src/entities/address.entity';
import { CreateAddressDto } from './dto/createAddress.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async createAddress(createAddressDto: CreateAddressDto): Promise<Address> {
    try {
      const address = this.addressRepository.create(createAddressDto);
      return await this.addressRepository.save(address);
    } catch (error) {
      console.error('Error creating address:', error.message);
      throw new BadRequestException('Failed to create address');
    }
  }

  async getAddressesByUserId(userId: string): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user: { id: userId } },
    });
  }

  async deleteAddress(addressId: string): Promise<void> {
    const result = await this.addressRepository.delete(addressId);
    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
  }
}
