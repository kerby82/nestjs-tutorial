import { Controller, Get } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() request) {
    return {
      userId: request.user.id,
      token: this.authService.getTokenForUser(request.user),
    };
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async profile(@Request() request) {
    return request.user;
  }
}
