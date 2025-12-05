import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    getCategory: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/admin/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    addSubcategory: builder.mutation({
      query: ({ categoryId, name }) => ({
        url: `/admin/categories/${categoryId}/subcategories`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteSubcategory: builder.mutation({
      query: ({ categoryId, subcategoryId }) => ({
        url: `/admin/categories/${categoryId}/subcategories/${subcategoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAddSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = categoryApi;

