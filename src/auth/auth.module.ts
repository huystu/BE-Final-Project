/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { RefreshToken } from 'src/entities/refreshtoken.entity'; // Import thực thể RefreshToken
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/userRole.entity';
import { UserModule } from 'src/app/users/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ConfigModule,
    TypeOrmModule.forFeature([User, RefreshToken, Role, UserRole]), // Thêm RefreshToken vào TypeOrmModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}