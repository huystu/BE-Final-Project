/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { ToggleActiveStatusDto } from './dto/toggleActiveUser.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}

  async register(
    email: string,
    password: string,
    phone: number,
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = password;
    user.phone = phone;
    return this.UsersRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return this.UsersRepository.find({
      where: {
        isDeleted: false,
      },
      order: {
        username: 'ASC',
      },
    });
  }
  async getUsersById(uuid: string): Promise<User> {
    const user = await this.UsersRepository.findOne({
      where: { id: uuid },
    });

    if (!user || !user.isActive) {
      throw new NotFoundException('User not found or inactive');
    }

    return user;
  }

  async toggleActiveStatus(
    toggleActiveStatusDto: ToggleActiveStatusDto,
  ): Promise<{ message: string }> {
    const { id } = toggleActiveStatusDto;
    console.log(id, 'asd');

    const user = await this.UsersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = !user.isActive;

    await this.UsersRepository.save(user);

    const status = user.isActive ? 'activated' : 'deactivated';
    return { message: `User has been ${status}` };
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.UsersRepository.findOne({ where: { id: id } });

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

  async getProfileById(uuid: string) {
    const user = await this.UsersRepository.findOne({
      where: { id: uuid },
      select: [
        'id',
        'username',
        'email',
        'fullName',
        'address',
        'phone',
        'url',
        'description',
        'avatar',
      ],
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

  async deleteUser(deleteUserDto: DeleteUserDto,): Promise<{ message: string }> {
    const { id } = deleteUserDto;

    const user = await this.UsersRepository.findOne({
      where: {
        id
      }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isDeleted = true; 
    await this.UsersRepository.save(user);

    return { message: 'User has been deleted' };
  }
}
