import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Brands"],
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => "/brands",
      providesTags: ["Brands"],
    }),
    getBrand: builder.query({
      query: (id) => `/brands/${id}`,
      providesTags: ["Brands"],
    }),
    createBrand: builder.mutation({
      query: (data) => ({
        url: "/admin/brands",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brands"],
    }),
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/brands/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Brands"],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/admin/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brands"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;

