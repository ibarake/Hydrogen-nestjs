import {
    CREATE_FAVORITE_MUTATION,
    CREATE_FAVORITE_INPUT,
} from "~/graphql/wishlist/WishlistMutation";
import {
    GET_FAVORITES_QUERY,
    GET_FAVORITES_INPUT,
    REMOVE_FAVORITE_MUTATION,
    REMOVE_FAVORITE_INPUT
} from "~/graphql/wishlist/WishlistQuery";
import { v4 } from "uuid";
import { useLoaderData } from "@remix-run/react";

/**
 * @param {LoaderFunctionArgs} args
 */

export async function loader({ request, context }) {
    const {storefront} = context;
    const session = context.session;
    const uuid = session.get('uuid');


    /**
     * HUGE TODO: change the fetch to a query to get variant ID
     */
    const response = await fetch(`http://localhost:8080/favorites/${uuid}`, {method: 'GET'});

    const json = await response.json();

    const products = json.map(async (favorite) => {
        const { product } = await storefront.query(GET_FAVORITES_QUERY, {
            variables: { id: `gid://shopify/Product/${favorite.productId}` },
        });
        return product;
    });
    const res = await Promise.all(products)
    return res;
    }


/**
 * @param {ActionFunctionArgs} args
 */
export async function action({ request, context }) {
  try {
    const formData = await request.formData();
    const productId = formData.get('productId');
    const operation = formData.get('operation');

    const sessionId = v4();
    const session = context.session;
    let uuid = session.get('uuid');
    if (!uuid) {
        uuid = session.set('uuid', sessionId);
    }

    /** 
     *TODO: Implement add favorite function utility
     * add favorite logic
     * @return {string} JSON.stringify({ success: true, data: addedFavorites})
     */
    if (operation === 'add') {
        const productIdParts = productId.split('/');
        const extractedId = productIdParts.pop();

        const query = CREATE_FAVORITE_MUTATION;
        const variables = CREATE_FAVORITE_INPUT(uuid, extractedId);

        const response = await fetch(`http://localhost:8080/graphql`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        if (!response.ok) {
            console.log(response);
            throw new Error("Error");
        }

        const json = await response.json();

        return JSON.stringify({ success: true, data: json});
    }


    /**
     * TODO: Implement remove favorite function utility
     * remove favorite logic
     * @return {string} JSON.stringify({ success: true, data: deletedFavorites})
     */
    if (operation === 'remove') {
        console.log(operation)
        const fetchFavorites = await fetch(`http://localhost:8080/favorites/${uuid}`, {method: 'GET'});

        const favoritesJSON = await fetchFavorites.json();

        const favorites = favoritesJSON.map((favorite) => favorite.productId === productId.split('/').pop() ? favorite : null);

        console.log(favorites);

        const deleteFavorites = favorites.map(async (favorite) => {
            console.log("id", favorite.id)
            const deleteFavorite = await fetch(`http://localhost:8080/favorites/${favorite.id}`, {method: 'DELETE'});
            const deletedFavoriteJSON = await deleteFavorite.json();
            return JSON.stringify({ success: true, data: deletedFavoriteJSON });
        });

        return JSON.stringify({sucess: true, data: deletedFavorites});
    }
  } catch (error) {
    console.log('Error processing form submission:', error);
    return JSON.stringify({ success: false, error: error.message });
  }
}

export default function Wishlist() {
    const loader = useLoaderData();
    return (
      <section className="wishlist">
        <table style={{ margin: "auto" }}>
            <thead>
                <tr>
                <th>Image</th>
                <th>Id</th>
                <th>Name</th>
                <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                {
                    loader?.map((favorite) => {
                        return (
                            <tr key={favorite.id.split('/').pop()}>
                                <td>
                                    <img src={favorite.featuredImage.url} alt={favorite.featuredImage.alt} style={{ width: "100px" }} />
                                </td>
                                <td>{favorite.id.split('/').pop()}</td>
                                <td>{favorite.title}</td>
                                <td>
                                    <form method="post" action="/wishlist" style={{ display: "flex", justifyContent: "center" }}>
                                        <input type="hidden" name="productId" value={favorite.id.split('/').pop()} />
                                        <input type="hidden" name="operation" value={"remove"} />
                                        <button type="submit">Remove</button>
                                    </form>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
      </section>
    );
  }