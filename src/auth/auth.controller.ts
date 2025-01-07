import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { Request } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() request) {
    return {
      userId: request.user.id,
      token: 'fake-jwt-token',
    };
  }
}
