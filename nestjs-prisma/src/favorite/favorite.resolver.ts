import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteInput } from './dto/create-favorite.input';

/**
 * Resolver for handling favorite-related GraphQL queries and mutations.
 */
@Resolver(() => Favorite)
export class FavoriteResolver {
  constructor(private readonly favoriteService: FavoriteService) {}

  /**
   * Query to find all favorites for a given user.
   * @param userId - The ID of the user.
   * @returns An array of favorite entities.
   */
  @Query(() => [Favorite], { name: 'favorites' })
  findFavorites(@Args('userId', { type: () => ID }) userId: string) {
    return this.favoriteService.findFavorites(userId);
  }

  /**
   * Mutation to create a new favorite.
   * @param createFavoriteInput - The input data for creating a favorite.
   * @returns The created favorite entity.
   */
  @Mutation(() => Favorite)
  createFavorite(@Args('createFavoriteInput') createFavoriteInput: CreateFavoriteInput) {
    return this.favoriteService.createFavorite(createFavoriteInput);
  }

  /**
   * Mutation to remove a favorite by its ID.
   * @param id - The ID of the favorite to be removed.
   * @returns The removed favorite entity.
   */
  @Mutation(() => Favorite)
  removeFavorite(@Args('id', { type: () => ID }) id: string) {
    return this.favoriteService.removeFavorite(id);
  }
}
