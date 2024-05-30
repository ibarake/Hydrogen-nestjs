import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async favoriteProduct(params: {
    userGid: string;
    productGid: string;
  }): Promise<User> {
    const { userGid, productGid } = params;

    const userId = await this.prisma.user.findUnique({
        where: { gid: userGid },
    });
    
    const productId = await this.prisma.product.findUnique({
        where: { gid: productGid },
    });

    if (!userId) {
        throw new Error(`User with ID ${userGid} does not exist`);
      }
    
    if (!productId) {
    throw new Error(`Product with ID ${productGid} does not exist`);
    }

    return this.prisma.user.update({
      where: { id: userId.id },
      data: {
        favorites: {
          connect: { id: productId.id },
        },
      },
    });
  }
}