import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'name is requerid' })
  @IsString({ message: 'name must be a string' })
  name: string;
  @IsNotEmpty({ message: 'email is requerid' })
  @IsString({ message: 'email must be a string' })
  email: string;
  @IsNotEmpty({ message: 'password is requerid' })
  password: string;
}
