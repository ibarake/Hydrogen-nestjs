import { Injectable } from '@nestjs/common';
import { CreateFavoriteInput } from './dto/create-favorite.input';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new favorite.
   * @param data - The data for creating a favorite.
   * @returns The created favorite.
   */
  async createFavorite(data: CreateFavoriteInput) {
    return await this.prisma.favorite.create({ data: { userId: data.userId, productId: data.productId } });
  }

  /**
   * Finds all favorites for a given user.
   * @param userId - The ID of the user.
   * @returns An array of favorites.
   */
  async findFavorites(userId: string) {
    return await this.prisma.favorite.findMany({ where: { userId: userId } });
  }

  /**
   * Removes a favorite by ID.
   * @param id - The ID of the favorite to remove.
   * @returns The removed favorite.
   */
  async removeFavorite(id: string) {
    return await this.prisma.favorite.delete({ where: { id: id } });
  }
}
