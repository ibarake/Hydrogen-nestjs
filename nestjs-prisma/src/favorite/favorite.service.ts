import { Injectable } from '@nestjs/common';
import { CreateFavoriteInput } from './dto/create-favorite.input';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async createFavorite(data: CreateFavoriteInput) {
    return await this.prisma.favorite.create({ data: { userId: data.userId, productId: data.productId } });
  }

  async findFavorites(id: string) {
    return await this.prisma.favorite.findMany({ where: { userId: id } });
  }

  async removeFavorite(id: string) {
    return await this.prisma.favorite.delete({ where: { id: id } });
  }
}
