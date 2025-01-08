import { AuthService } from './auth.service';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from './input/create.user.dto';
import { Post } from '@nestjs/common';
import { User } from './user.entity';
import { Body } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('')
  public async create(@Body() createUserDto: CreateUserDto) {
    const user = new User();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }
}
