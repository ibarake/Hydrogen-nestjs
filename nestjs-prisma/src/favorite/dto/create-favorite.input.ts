import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateFavoriteInput {
  @Field(() => ID)
  userId: string;
  
  @Field(() => ID)
  productId: string;
}
