import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteResolver } from './favorite.resolver';
import { FavoriteService } from './favorite.service';

describe('FavoriteResolver', () => {
  let resolver: FavoriteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteResolver, FavoriteService],
    }).compile();

    resolver = module.get<FavoriteResolver>(FavoriteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return a favorite', async () => {
    const result = { id: '1', userId: '1', productId: '1' };
    jest.spyOn(resolver, 'createFavorite').mockImplementation(() => Promise.resolve(result));

    expect(await resolver.createFavorite({ userId: '1', productId: '1' })).toBe(result);
  });

  it('should return an array of favorites', async () => {
    const result = [{ id: '1', userId: '1', productId: '1' }];
    jest.spyOn(resolver, 'findFavorites').mockImplementation(() => Promise.resolve(result));

    expect(await resolver.findFavorites('1')).toBe(result);
  });

  it('should return a favorite', async () => {
    const result = { id: '1', userId: '1', productId: '1' };
    jest.spyOn(resolver, 'removeFavorite').mockImplementation(() => Promise.resolve(result));

    expect(await resolver.removeFavorite('1')).toBe(result);
  });
});
