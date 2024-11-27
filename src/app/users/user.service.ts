/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UpdateProfileDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}

  async register(email: string, password: string, phoneNumber: number ): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = password;
    user.phoneNumber = phoneNumber;
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

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { id,  oldPassword, newPassword } = changePasswordDto;
    const user = await this.UsersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'New password must be different from old password',
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await this.UsersRepository.save(user);

    return { message: 'Password changed successfully' };
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
