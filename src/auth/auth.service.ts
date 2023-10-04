import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { validate } from 'class-validator';
import { compareHashPassword, encryptPassword } from 'src/utils/bcrypt.utils';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(userObjectLogin: LoginUserDto) {
    const errors = await validate(userObjectLogin);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: userObjectLogin.email },
      });
      if (!user) throw new NotFoundException('User not found');
      const passwordIsValid = await compareHashPassword(
        userObjectLogin.password,
        user.password,
      );
      if (!passwordIsValid) throw new UnauthorizedException('Password invalid');
      delete user.password;
      const payload = { userId: user.id };
      const token = await this.jwtService.sign(payload);
      const data = { user, token };
      return data;
    } catch (error) {
      throw error;
    }
  }
  async createUser(createUserDto: CreateUserDto) {
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exist');
      }
      createUserDto.role = Role.USER;
      createUserDto.password = await encryptPassword(createUserDto.password);
      const user = await this.prisma.user.create({
        data: createUserDto,
      });
      delete user.password;
      const payload = { userId: user.id };
      const token = await this.jwtService.sign(payload);
      const data = { user, token };
      return data;
    } catch (error) {
      throw error;
    }
  }
}
