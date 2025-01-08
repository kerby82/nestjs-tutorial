import { Controller, Get } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthGuardLocal } from './auth-guard.local';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('/profile')
  @UseGuards(AuthGuardJwt)
  async profile(@CurrentUser() user: User) {
    return user;
  }
}
