import {
  Body,
  Controller,
  Post,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}
  @Post('register')
  async register(@Body() userObject: CreateUserDto) {
    try {
      return await this.authService.createUser(userObject);
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
  @Post('login')
  async login(@Body() userObjectLogin: LoginUserDto) {
    try {
      return await this.authService.login(userObjectLogin);
    } catch (error) {
      if (error instanceof BadRequestException) {
        // Si es una BadRequestException, devolvemos los detalles de validación
        throw error;
      } else if (error instanceof ConflictException) {
        // Si es una ConflictException, devolvemos el mensaje de conflicto
        throw error;
      } else if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        console.log('el error esssss  ', error);
        // Para cualquier otra excepción, devolvemos un mensaje genérico
        throw new BadRequestException('Something bad happened', {
          cause: error,
        });
      }
    }
  }
}
