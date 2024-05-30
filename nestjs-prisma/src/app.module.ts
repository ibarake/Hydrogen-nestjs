import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';
import { ProductService } from './product.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, UserService, ProductService],
})
export class AppModule {}
