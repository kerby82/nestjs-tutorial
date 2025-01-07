import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(LocalStrategy.name);

  constructor(private readonly userRepository: Repository<User>) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      this.logger.error(`User ${username} not found`);
      throw new UnauthorizedException();
    }

    if (user.password !== password) {
      this.logger.error(`Invalid credentials for user ${username}`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
