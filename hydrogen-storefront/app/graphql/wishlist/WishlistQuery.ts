export const GET_FAVORITES_QUERY = `
query getProductById($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      featuredImage{
        url
        altText
      }
    }
  }
`;