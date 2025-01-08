import { Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @Length(4, 20)
  username: string;

  @Length(8, 20)
  password: string;

  @Length(8, 20)
  retypedPassword: string;

  @Length(2, 20)
  firstName: string;

  @Length(2, 20)
  lastName: string;

  @IsEmail()
  email: string;
}
