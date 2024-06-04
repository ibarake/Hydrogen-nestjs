export const GET_FAVORITES_QUERY = `
query getProductById($id: ID!) {
    product(id: $id) {
      id
      title
      featuredImage{
        url
        altText
      }
    }
  }
`

export const REMOVE_FAVORITE_MUTATION = `#graphql
    mutation removeFavoriteMutation($input: ID!){
    removeFavorite(id: $input){
        id
        userId
        productId
    }
    }
`

export function REMOVE_FAVORITE_INPUT(id){
    return  {
            id: id
            }
}
