import {
    CREATE_FAVORITE_MUTATION,
    CREATE_FAVORITE_INPUT,
} from "../graphql/wishlist/WishlistMutation";
import {
    GET_FAVORITES_QUERY,
} from "../graphql/wishlist/WishlistQuery";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { getSeoMeta } from "@shopify/hydrogen";
import {
    defer,
    type MetaArgs,
    redirect,
    AppLoadContext
  } from '@shopify/remix-oxygen';

/**
 * Represents a favorite item in the wishlist.
 */
type Favorite = {
    id: string;
    userId: string;
    productId: string;
    handle: string;
    featuredImage: {
        url: string;
        alt: string;
    };
    title: string;
};

/**
 * Loads the data for the wishlist page.
 * @param {LoaderFunctionArgs} - The HTTP request object. and The Remix app load context.
 * @returns A promise that resolves to an array of favorite products.
 */
export async function loader({ request, context }: { request: Request, context: AppLoadContext }) {
    const { storefront } = context;
    const session = context.session;
    let uuid = session.get('uuid');

    // TODO: change the fetch to a query to get variant ID
    const response = await fetch(`http://localhost:8080/favorites/${uuid}`, { method: 'GET' });

    const json = await response.json() as Favorite[];

    const products: Promise<Favorite>[] = json.map(async (favorite: Favorite) => {
        const { product } = await storefront.query(GET_FAVORITES_QUERY, {
            variables: { id: `gid://shopify/Product/${favorite.productId}` },
        });
        return product;
    });

    const res = await Promise.all(products);
    
    return res;
}

/**
 * Handles the actions performed on the wishlist page.
 * @param {ActionFunctionArgs} - The HTTP request object and The Remix app load context.
 * @returns {Response} A response indicating the success or failure of the action.
 */
export async function action({ request, context }: { request: Request, context: AppLoadContext }) {
        const formData = await request.formData();
        const productId = formData.get('productId') as string;
        const operation = formData.get('operation') as string;

        const session = context.session;
        let uuid = session.get('uuid');

        if (operation === 'add') {
            const productIdParts = productId.split('/');
            const extractedId = productIdParts.pop() as string;

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

            return new Response(JSON.stringify({ success: true, data: json }), { status: 200 });
        }

        if (operation === 'remove') {
            const fetchFavorites = await fetch(`http://localhost:8080/favorites/${uuid}`, { method: 'GET' });

            const favoritesJSON = await fetchFavorites.json() as Favorite[];

            const favorites = favoritesJSON.map((favorite: Favorite) => favorite.productId === productId.split('/').pop() ? favorite : null);

            const deleteFavorites: Promise<string>[] = favorites.map(async (favorite: Favorite | null) => {
                if (favorite && favorite.id){
                    const deleteFavorite = await fetch(`http://localhost:8080/favorites/${favorite.id}`, { method: 'DELETE' });
                    const deletedFavoriteJSON = await deleteFavorite.json();
                    return JSON.stringify({ success: true, data: deletedFavoriteJSON });
                }
                return JSON.stringify({ success: false, data: {} });

            });

            const deletedFavorites = await Promise.all(deleteFavorites);
            return new Response(JSON.stringify({ success: true, data: deletedFavorites }), { status: 200 });
        }
}

/**
 * Renders the wishlist page.
 * @returns {JSX element} representing the wishlist page.
 */
export default function Wishlist() {
    const res = useLoaderData<Favorite[]>();
    return (
        <section className="wishlist">
            <table className="m-auto border-separate border-spacing-9">
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
                        res?.map((favorite) => (
                            <tr key={favorite.id.split("/").pop()} id={favorite.handle}>
                                <td>
                                    <a href={`/products/${favorite.handle}`}>
                                    <img src={favorite.featuredImage.url} alt={favorite.featuredImage.alt} style={{ width: "100px" }} />
                                    </a>
                                </td>
                                <td>{favorite.id.split('/').pop()}</td>
                                <td><a href={`/products/${favorite.handle}`}>{favorite.title}</a></td>
                                <td>
                                    <form id="wishlist-page-remove" method="post" action="/pages/wishlist" style={{ display: "flex", justifyContent: "center" }}>
                                        <input type="hidden" name="productId" value={favorite.id.split('/').pop()} />
                                        <input type="hidden" name="operation" value={"remove"} />
                                        <button type="submit" className="rounded font-medium text-center py-3 px-6 bg-primary text-contrast w-full">Remove</button>
                                    </form>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </section>
    );
}