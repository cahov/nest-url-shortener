import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private UserService: UsersService) {}
  @Get()
  async getAllUsers() {
    try {
      const users = await this.UserService.getAllUsers();
      return { users, message: 'Users found' };
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.UserService.createUser(createUserDto);
      return { newUser, message: 'User create success' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        // Si es una BadRequestException, devolvemos los detalles de validación
        throw error;
      } else if (error instanceof ConflictException) {
        // Si es una ConflictException, devolvemos el mensaje de conflicto
        throw error;
      } else {
        console.log(error);
        // Para cualquier otra excepción, devolvemos un mensaje genérico
        throw new BadRequestException('Something bad happened', {
          cause: error,
        });
      }
    }
  }
}
