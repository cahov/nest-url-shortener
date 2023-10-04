import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'email is requerid' })
  @IsString({ message: 'email must be a string' })
  email: string;
  @IsNotEmpty({ message: 'password is requerid' })
  password: string;
}
