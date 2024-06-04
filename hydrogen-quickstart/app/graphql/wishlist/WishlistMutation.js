export const CREATE_FAVORITE_MUTATION = `#graphql
    mutation createFavoriteMutation($input: CreateFavoriteInput!){
    createFavorite(createFavoriteInput: $input){
        userId
        productId
    }
    }
`;

export function CREATE_FAVORITE_INPUT(userId, productId) {
    return  {
                input: {
                    userId: userId,
                    productId: productId
                }
            }
}