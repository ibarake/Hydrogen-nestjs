import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';
import { ProductService } from './product.service';
import { User as UserModel, Product as ProductModel } from '@prisma/client';


describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [PrismaService, UserService, ProductService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getUserByGid', () => {
    it('should return a user', async () => {
      const user: UserModel = {
        id: "1",
        gid: '1'
      }
      jest.spyOn(appController, 'getUserByGid').mockImplementation(() => Promise.resolve(user));
      expect(await appController.getUserByGid('1')).toBe(user);
    });
  });

  describe('getProductByGid', () => {
    it('should return a product', async () => {
      const product: ProductModel = {
        id: "1",
        gid: '1'
      }
      jest.spyOn(appController, 'getProductByGid').mockImplementation(() => Promise.resolve(product));
      expect(await appController.getProductByGid('1')).toBe(product);
    });
  })

  describe('addFavoriteProduct', () => {
    it('should return a user', async () => {
      const user: UserModel = {
        id: "1",
        gid: '1'
      }
      jest.spyOn(appController, 'addFavoriteProduct').mockImplementation(() => Promise.resolve(user));
      expect(await appController.addFavoriteProduct('1', '1')).toBe(user);
    });
  })
  
});
