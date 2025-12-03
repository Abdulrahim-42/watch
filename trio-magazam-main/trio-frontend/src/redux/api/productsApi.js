import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
    }),
    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/admin/products",
        method: "POST",
        body: productData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
    }),
    editProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    getCart: builder.query({
      query: () => "/products/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "/products/cart",
        method: "POST",
        body: { productId, quantity },
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/products/cart/update/${productId}`,
        method: "PUT",
        body: { quantity },
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/products/cart/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
    getFavorites: builder.query({
      query: () => "/products/favorites",
      providesTags: ["Favorites"],
      transformResponse: (response) => ({
        favorites: response?.favorites || [],
      }),
    }),
    addToFavorites: builder.mutation({
      query: (productId) => ({
        url: "/products/favorites",
        method: "POST",
        body: { productId },
        credentials: "include",
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFromFavorites: builder.mutation({
      query: (productId) => ({
        url: `/products/favorites/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Favorites"],
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            productApi.util.updateQueryData("getFavorites", undefined, (draft) => {
              draft.favorites = draft.favorites.filter(
                (favorite) => favorite._id !== productId
              );
            })
          );
        } catch {
          // No additional action is needed if mutation fails
        }
      },
    }),
    searchProducts: builder.query({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: "/products/search",
        params: { query, page, limit },
      }),
    }),
    // Yeni filter endpoint‑i
    filterProducts: builder.query({
      query: (filters) => ({
        url: "/products/filter",
        params: filters,
      }),
    }), 

    createOrUpdateReview: builder.mutation({
      query: (reviewData) => ({
        url: "/products/review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Products"],
    }),
        getProductReviews: builder.query({
          query: (id) => `/products/${id}/reviews`,
          providesTags: ["Reviews"],
        }), 
  }),
});

// Yaratılan hook‑ları ixrac edirik, filter endpoint‑i üçün "useFilterProductsQuery" hook‑u yaranacaq.
export const {
  useGetProductDetailsQuery,
  useGetProductsQuery,
  useGetFavoritesQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetCartQuery,
  useSearchProductsQuery,
  useCreateOrUpdateReviewMutation, useGetProductReviewsQuery ,
  useFilterProductsQuery, // Hook for filtering products
} = productApi;