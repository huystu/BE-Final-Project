import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UpdateProfileDto } from './dto/update-user.dto';

@Controller('user')
// @UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  getStands() {
    return this.userService.getUsers();
  }

  @Patch('changePassword')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(changePasswordDto);
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    // if (!req.user || !req.user.id) {
    //   throw new UnauthorizedException('Không tìm thấy người dùng trong token');
    // }
    return this.userService.getProfileById(req.user.id);
  }

  @Put('edit-profile')
  @UseGuards(JwtAuthGuard)
  async editProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    console.log('Decoded User:', req.user);
    // if (!req.user || !req.user.id) {
    //   throw new UnauthorizedException('User not found in token');
    // }
    return this.userService.updateProfile(req.user.id, updateProfileDto);
  }
}
