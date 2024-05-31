import { Controller, Delete, Get, Post, Param, Body  } from '@nestjs/common';
import { FavoriteService } from './favorite/favorite.service';
import { Favorite as FavoriteModel } from '@prisma/client';

@Controller()
export class AppController {
    constructor(
        private readonly FavoriteService: FavoriteService
    ) {}

    @Get('favorites/:id')
    async getFavorites(
        @Param('id') id: string,
    ): Promise<FavoriteModel[]> {
        return this.FavoriteService.findFavorites(id);
    }

    @Post('favorite')
    async addFavoriteProduct(
        @Body('userId') userId: string,
        @Body('productId') productId: string,
    ): Promise<FavoriteModel> {
        return this.FavoriteService.createFavorite({
            userId: userId,
            productId: productId,
        });
    }

    @Delete('favorite')
    async removeFavoriteProduct(
        @Param('id') id: string,
    ): Promise<FavoriteModel> {
        return this.FavoriteService.removeFavorite(id);
    }
}
