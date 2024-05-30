import { Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ProductService } from './product.service';
import { User as UserModel, Product as ProductModel } from '@prisma/client';


@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  @Get('product/:id')
  async getProductByGid(@Param('id') id: string): Promise<ProductModel> {
    return this.productService.product({ gid: String(id) });
  }

  @Get('user/:id')
  async getUserByGid(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ gid: String(id) });
  }

  @Post('favorite/:userId/:productId')
  async addFavoriteProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<UserModel> {

    const user = await this.userService.user({ gid: String(userId) });
    const product = await this.productService.product({ gid: String(productId) });

    console.log(user, product);
    
    if (!user){
      const createUser = await this.userService.createUser({ gid: String(userId) });
    }

    if (!product){
      const createProduct = await this.productService.createProduct({ gid: String(productId) });
    }

    return this.userService.favoriteProduct({
      userGid: String(userId),
      productGid: String(productId),
    });
  }
}
