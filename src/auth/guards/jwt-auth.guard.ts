/* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}
import { Injectable,  ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // handleRequest(err, user, info) {
  //   if (err || !user) {
  //     console.error('JwtAuthGuard Error:', info); 
  //     throw new UnauthorizedException('Invalid or missing token');
  //   }
  //   return user;
  // }
}

