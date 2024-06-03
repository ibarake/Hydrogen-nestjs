import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteResolver } from './favorite.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [FavoriteResolver, FavoriteService, PrismaService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
