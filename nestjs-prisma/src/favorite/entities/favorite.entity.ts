import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Favorite {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;
  
  @Field(() => ID)
  productId: string;
}
