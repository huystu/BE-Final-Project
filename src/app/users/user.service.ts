/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = password;
    return this.UsersRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return this.UsersRepository.find();
  }
  async getUsersById(id: string): Promise<User> {
    return await this.UsersRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  async getProfileById(userId: string) {
    const user = await this.UsersRepository.findOne({
      where: { id: userId },
      select: [
        'id', 
        'username', 
        'email', 
        'fullName', 
        'address', 
        'phoneNumber', 
        'url', 
        'description', 
        'avatar'
      ]
    });
  
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
  
    return user;
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto) {
    const user = await this.UsersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);

    return this.UsersRepository.save(user);
  }

}
