import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }), // Backend URL-inizi uyğunlaşdırın
  endpoints: (builder) => ({
    // Bütün blog yazılarını gətirir
    getBlogs: builder.query({
      query: () => "/blogs",
    }),
    // Seçilmiş blog yazısının detallarını gətirir
    getBlogDetails: builder.query({
      query: (id) => `/blogs/${id}`,
    }),
    // Yeni blog yazısı yaradır
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: "/admin/blogs",
        method: "POST",
        body: blogData,
      }),
    }),
    // Mövcud blog yazısını yeniləyir
    updateBlog: builder.mutation({
      query: ({ id, blogData }) => ({
        url: `/admin/blogs/${id}`,
        method: "PUT",
        body: blogData,
      }),
    }),
    // Blog yazısını silir
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/blogs/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogDetailsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
