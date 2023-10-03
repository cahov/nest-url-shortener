import { Module } from '@nestjs/common';
import { ShortenerModule } from './shortener/shortener.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ShortenerModule, PrismaModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
