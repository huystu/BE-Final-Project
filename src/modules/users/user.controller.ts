import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('stands')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getStands() {
    return this.userService.getUsers();
  }
}
