/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { RefreshToken } from 'src/entities/refreshtoken.entity';
import { MailService } from 'src/provider/mail/mail.service';
import { Repository } from 'typeorm';
import { ForgotPasswordDTO } from './dto/forgotPassword.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from 'src/entities/userRole.entity';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, username, password, phone } = registerDto;
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestException('Email already exists');
      }
      if (existingUser.username === username) {
        throw new BadRequestException('Username already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
      phone,
    });
    const userRole = await this.roleRepository.findOne({
      where: {
        name: 'user',
      },
    });
    const user = await this.userRepository.save(newUser);
    const relationUser = this.userRoleRepository.create({
      role: userRole,
      user: user,
    });
    await this.userRoleRepository.save(relationUser);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });

    let userWithRole;

    if (user) {
      userWithRole = {
        ...user,
        role: user.userRoles.map((userRole) => userRole.role),
      };
    }

    if (user && !user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated.');
    }

    if (userWithRole && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = userWithRole;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '24h',
    });

    // Tạo refresh token
    const refreshToken = await this.createRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken.token,
      userId: user.id,
      roles: user.role.map((item) => item.name)[0] ?? '',
    };
  }

  async createRefreshToken(user: User): Promise<RefreshToken> {
    // Xóa refresh token cũ nếu có
    await this.refreshTokenRepository.delete({ userId: user.id });

    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 7); // Token hết hạn sau 7 ngày

    const refreshToken = this.refreshTokenRepository.create({
      user: user,
      userId: user.id,
      token: this.jwtService.sign(
        { userId: user.id },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
      expiresAt: expiration,
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }

  async refreshAccessToken(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > token.expiresAt) {
      await this.refreshTokenRepository.delete({ token: refreshToken });
      throw new UnauthorizedException('Refresh token expired');
    }

    const payload = { id: token.user.id, email: token.user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    return {
      access_token: accessToken,
    };
  }

  async logout(userId: string) {
    await this.refreshTokenRepository.delete({ userId });
    return {
      message: 'Logged out successfully',
    };
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
    const { email } = forgotPasswordDTO;

    const currentUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!currentUser) {
      throw new BadRequestException('User not found');
    }

    const newPassword = this.generateRandomPassword(8);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    currentUser.password = hashedPassword;
    await this.userRepository.save(currentUser);

    // Xóa refresh token khi reset password
    await this.refreshTokenRepository.delete({ userId: currentUser.id });

    await this.mailService.sendMail(
      email,
      `Your new password is: ${newPassword}`,
    );

    return {
      message: 'New Password has been sent to your email and updated securely',
    };
  }

  private generateRandomPassword(length: number): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const allChars = uppercase + lowercase + numbers;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    for (let i = 3; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    return password;
  }
}
