import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FavoriteModule } from './favorite/favorite.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
   }),
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
