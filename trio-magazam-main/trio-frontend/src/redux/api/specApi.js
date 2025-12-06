import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const specApi = createApi({
  reducerPath: "specApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Specs"],
  endpoints: (builder) => ({
    getSpecs: builder.query({
      query: () => "/specs",
      providesTags: ["Specs"],
    }),
    getSpec: builder.query({
      query: (id) => `/specs/${id}`,
      providesTags: ["Specs"],
    }),
    createSpec: builder.mutation({
      query: (data) => ({
        url: "/admin/specs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specs"],
    }),
    updateSpec: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/specs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Specs"],
    }),
    deleteSpec: builder.mutation({
      query: (id) => ({
        url: `/admin/specs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specs"],
    }),
  }),
});

export const {
  useGetSpecsQuery,
  useGetSpecQuery,
  useCreateSpecMutation,
  useUpdateSpecMutation,
  useDeleteSpecMutation,
} = specApi;

