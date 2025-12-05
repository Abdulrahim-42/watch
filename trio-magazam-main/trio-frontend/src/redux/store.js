import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi";
import { authApi } from "./api/authApi";
import { blogApi } from "./api/blogApi";  // Yeni blogApi import edilir
import { categoryApi } from "./api/categoryApi";  // Category API import edilir
import userReducer from "./features/userSlice"; // userSlice default export -> userReducer adı ilə

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer, // productApi reducer əlavə edildi
    [authApi.reducerPath]: authApi.reducer,       // authApi reducer əlavə edildi
    [blogApi.reducerPath]: blogApi.reducer,       // blogApi reducer əlavə edildi
    [categoryApi.reducerPath]: categoryApi.reducer, // categoryApi reducer əlavə edildi
    user: userReducer,                            // ✅ Artıq state.user mövcuddur
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      blogApi.middleware,  // blogApi middleware əlavə edildi
      categoryApi.middleware,  // categoryApi middleware əlavə edildi
    ]),
});
