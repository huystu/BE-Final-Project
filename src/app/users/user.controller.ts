import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { ToggleActiveStatusDto } from './dto/toggleActiveUser.dto';

@Controller('user')
// @UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  getStands() {
    return this.userService.getUsers();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    return this.userService.getProfileById(req.user.id);
  }

  @Patch('changePassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const userId = req.user.id; // Lấy id người dùng từ token
    return this.userService.changePassword(userId, changePasswordDto);
  }

  @Patch('activeStatus')
  async toggleActiveStatus(
    @Body() toggleActiveStatusDto: ToggleActiveStatusDto,
  ): Promise<{ message: string }> {
    return this.userService.toggleActiveStatus(toggleActiveStatusDto);
  }

  
  @Put('edit-profile')
  @UseGuards(JwtAuthGuard)
  async editProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    console.log('Decoded User:', req.user);
    return this.userService.updateProfile(req.user.id, updateProfileDto);
  
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUsersById(id);
  }
}
