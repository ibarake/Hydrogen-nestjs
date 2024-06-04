import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { PrismaService } from '../prisma.service';

/**
 * Test suite for the FavoriteService class.
 */
describe('FavoriteService', () => {
  let service: FavoriteService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteService, PrismaService],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  /**
   * Test case for the "createFavorite" method.
   */
  describe('createFavorite', () => {
    /**
     * Test case for creating a favorite.
     */
    it('should create a favorite', async () => {
      const createFavoriteInput = { userId: 'user123', productId: 'product123' };

      jest.spyOn(prismaService.favorite, 'create').mockResolvedValueOnce({ id: 'favorite123', ...createFavoriteInput });

      const result = await service.createFavorite(createFavoriteInput);

      expect(prismaService.favorite.create).toHaveBeenCalledWith({ data: createFavoriteInput });
      expect(result).toEqual({ id: 'favorite123', ...createFavoriteInput });
    });
  });

  /**
   * Test case for the "findFavorites" method.
   */
  describe('findFavorites', () => {
    /**
     * Test case for finding favorites by userId.
     */
    it('should find favorites by userId', async () => {
      const userId = 'user123';
      const favorites = [{ id: 'favorite123', userId, productId: 'product123' }];

      jest.spyOn(prismaService.favorite, 'findMany').mockResolvedValueOnce(favorites);

      const result = await service.findFavorites(userId);

      expect(prismaService.favorite.findMany).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual(favorites);
    });
  });

  /**
   * Test case for the "removeFavorite" method.
   */
  describe('removeFavorite', () => {
    /**
     * Test case for removing a favorite by id.
     */
    it('should remove a favorite by id', async () => {
      const id = 'favorite123';
      const favorite = { id, userId: 'user123', productId: 'product123' };

      jest.spyOn(prismaService.favorite, 'delete').mockResolvedValueOnce(favorite);

      const result = await service.removeFavorite(id);

      expect(prismaService.favorite.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(favorite);
    });
  });
});
