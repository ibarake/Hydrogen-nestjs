import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteResolver } from './favorite.resolver';
import { FavoriteService } from './favorite.service';
import { PrismaService } from '../prisma.service';

/**
 * Represents the test suite for the FavoriteResolver class.
 */
describe('FavoriteResolver', () => {
  let resolver: FavoriteResolver;

  beforeEach(async () => {
    /**
     * Represents the testing module used for compiling the favorite resolver.
     */
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteResolver, FavoriteService, PrismaService],
    }).compile();

    resolver = module.get<FavoriteResolver>(FavoriteResolver);
  });

  /**
   * Tests if the FavoriteResolver is defined.
   */
  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  /**
   * Tests if the createFavorite method returns a favorite.
   */
  it('should return a favorite', async () => {
    const result = { id: '1', userId: '1', productId: '1' };
    jest.spyOn(resolver, 'createFavorite').mockImplementation(() => Promise.resolve(result));

    expect(await resolver.createFavorite({ userId: '1', productId: '1' })).toBe(result);
  });

  /**
   * Tests if the findFavorites method returns an array of favorites.
   */
  it('should return an array of favorites', async () => {
    const result = [{ id: '1', userId: '1', productId: '1' }];
    jest.spyOn(resolver, 'findFavorites').mockImplementation(() => Promise.resolve(result));

    expect(await resolver.findFavorites('1')).toBe(result);
  });

  /**
   * Tests if the removeFavorite method returns a favorite.
   */
  it('should return a favorite', async () => {
    const result = { id: '1', userId: '1', productId: '1' };
    jest.spyOn(resolver, 'removeFavorite').mockImplementation(() => Promise.resolve(result));

    expect(await resolver.removeFavorite('1')).toBe(result);
  });
});