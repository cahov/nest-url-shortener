import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { encryptPassword } from 'src/utils/bcrypt.utils';

@Injectable()
export class UsersService {
  constructor(private readonly Prisma: PrismaService) {}
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.Prisma.user.findMany({});
      return users;
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.Prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch user by email');
    }
  }
  async getUserProfile(userId: string) {
    try {
      const user = await this.Prisma.user.findUnique({
        where: { id: userId }, // Buscar al usuario por su ID
        select: { name: true, email: true }, // Seleccionar solo los campos que deseas devolver en el perfil
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch user profile');
    }
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    try {
      const existingUser = await this.Prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exist');
      }
      createUserDto.role = 'USER';
      createUserDto.password = await encryptPassword(createUserDto.password);
      const newUser = await this.Prisma.user.create({
        data: createUserDto,
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }
  async deleteAllUsers(): Promise<void> {
    try {
      await this.Prisma.user.deleteMany({});
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete all users');
    }
  }
  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const user = await this.Prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.Prisma.user.delete({
        where: { email },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete user by email');
    }
  }
}
