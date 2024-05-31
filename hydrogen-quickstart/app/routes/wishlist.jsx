const CREATE_FAVORITE_MUTATION = `#graphql
    mutation createFavoriteMutation($input: CreateFavoriteInput!){
    createFavorite(createFavoriteInput: $input){
        userId
        productId
    }
    }
`;

const CREATE_FAVORITE_INPUT = `#graphql
    {
        "input": {
            "userId": "1",
            "productId": "1"
        }
    }
`

const GET_FAVORITES_INPUT = `#graphql
    query findFavoritesQuery($userId: ID!) {
    favorites(userId: $userId){
        id
        userId
        productId
    }
    }
`

const GET_FAVORITES_VARIABLES = `#graphql
    {
    "userId": "1"
    }
`

const REMOVE_FAVORITE_MUTATION = `#graphql
    mutation removeFavoriteMutation($id: ID!){
    removeFavorite(id: $id){
        id
        userId
        productId
    }
    }
`

const REMOVE_FAVORITE_INPUT = `#graphql
    {
    "id": "clwu7k17r00007ef3xjawm8uw"
    }
`

/**
 * @param {LoaderFunctionArgs} args
 */

export async function loader({ request, context }) {
    const {storefront} = context;
    const cookies = request.headers.get('Cookie')
    const sessionId = cookies.split(';').find((cookie) => cookie.includes('session')).split('=')[1];

    
    return null
}


/**
 * @param {ActionFunctionArgs} args
 */
export async function action({ request }) {
  try {
    const formData = await request.formData();
    const productId = formData.get('productId');
    const sessionId = formData.get('sessionId');

    const productIdParts = productId.split('/');
    const extractedId = productIdParts.pop();

    const response = await fetch(`http://localhost:8080/favorite`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            productId: extractedId,
            userId: sessionId,
        }),
    });

    if (!response.ok) {
        console.log(response);
        throw new Error("Error");
    }

    const json = await response.json();

    return JSON.stringify({ success: true, data: json});
  } catch (error) {
    console.error('Error processing form submission:', error);
    return JSON.stringify({ success: false, error: error.message });
  }
}

export default function Wishlist() {
    return (
      <section className="wishlist">
        <table style={{ margin: "auto" }}>
            <thead>
                <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>
                    <img src="https://via.placeholder.com/150" alt="Product 1" />
                </td>
                <td>Product 1</td>
                <td>$19.99</td>
                <td>
                    <form action="/wishlist" method="post">
                    <input type="hidden" name="productId" value="gid://shopify/Product/123456789" />
                    <button type="submit">Remove</button>
                    </form>
                </td>
                </tr>
                <tr>
                <td>
                    <img src="https://via.placeholder.com/150" alt="Product 1" />
                </td>
                <td>Product 2</td>
                <td>$14.99</td>
                <td>
                    <form action="/wishlist" method="post">
                    <input type="hidden" name="productId" value="gid://shopify/Product/987654321" />
                    <button type="submit">Remove</button>
                    </form>
                </td>
                </tr>
            </tbody>
        </table>
      </section>
    );
  }