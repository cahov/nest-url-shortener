import { Module } from '@nestjs/common';
import { ShortenerModule } from './shortener/shortener.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ShortenerModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
