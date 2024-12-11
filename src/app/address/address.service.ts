import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'src/entities/address.entity';
import { CreateAddressDto } from './dto/createAddress.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
  ): Promise<{ message: string; data: Partial<Address> }> {
    try {
      const { userId, ...addressData } = createAddressDto;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const address = this.addressRepository.create({
        ...addressData,
        user,
      });

      const savedAddress = await this.addressRepository.save(address);

      const { user: _, ...responseAddress } = savedAddress;

      return {
        message: 'Address created successfully',
        data: responseAddress,
      };
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

  async getAddressById(addressId: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { addressId },
      relations: ['user'], 
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async deleteAddress(addressId: string): Promise<void> {
    const result = await this.addressRepository.delete(addressId);
    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
  }
}
