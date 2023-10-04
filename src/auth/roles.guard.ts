import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const userId = user?.userId;

    if (!userId) {
      return false;
    }

    const requiredRole = this.reflector.get<string>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRole) {
      return false;
    }

    const userInDb = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!userInDb) {
      return false;
    }

    const userRole = userInDb.role;

    return this.matchRoles(userRole, requiredRole);
  }

  private matchRoles(userRole: string, requiredRole: string): boolean {
    if (!userRole) return false;
    return userRole === requiredRole;
  }
}
