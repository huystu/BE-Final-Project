/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDTO } from './dto/forgotPassword.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('forgotPassword')
  forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    return this.authService.forgotPassword(forgotPasswordDTO);
  }
}
