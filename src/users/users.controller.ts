import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private UserService: UsersService) {}
  @Get()
  @SetMetadata('roles', 'ADMIN') // Especifica el rol requerido para esta ruta
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard) // Proteger la ruta con JwtAuthGuard
  @Get('profile')
  async getUserProfile(@Req() req) {
    const userId = req.user.userId; // Acceder al userId del usuario autenticado
    // Luego, utiliza el userId para obtener el perfil del usuario desde tu servicio
    const userProfile = await this.UserService.getUserProfile(userId);
    return userProfile;
  }
}
