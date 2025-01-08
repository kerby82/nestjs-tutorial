import { Controller, Get } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async profile(@CurrentUser() user: User) {
    return user;
  }
}
