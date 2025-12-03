// MVC Model View Controller
// Middleware

import express from "express"
const router = express.Router()

// Mehsullar ucun controller
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import { addToCart, getCartProducts, removeFromCart, updateCartQuantity } from "../controller/cartController.js";
import { 
    addToFavorites, 
    getFavoriteProducts, 
    removeFromFavorites
  } from "../controller/favoriteController.js";

import { getProducts, getProductDetails, updateProduct, deleteProduct, newProduct, searchProducts, createOrUpdateReview, getProductReviews} from "../controller/productController.js";
import { uploadImages } from "../middleware/multer.js"
import { getFilterControllers } from "../controller/filterController.js";

// Middleware arasdir
// get READ , post CREATE , put UPDATE , delete DELETE

// Favorilere ekleme (toggle)
router.post("/products/favorites", isAuthenticatedUser, addToFavorites);
router.get("/products/search", searchProducts);
router.get("/products/filter", getFilterControllers);

// Kullanıcının tüm favorilerini getirme
router.get("/products/favorites", isAuthenticatedUser, getFavoriteProducts);

// Favoriden ürün çıkarma
router.delete("/products/favorites/:productId", isAuthenticatedUser, removeFromFavorites);

//Userin giris ede bileceyi 
router.put('/products/cart/update/:productId', isAuthenticatedUser, updateCartQuantity);
router.post("/products/cart", isAuthenticatedUser, addToCart);
router.delete("/products/cart/:productId", isAuthenticatedUser, removeFromCart);
router.get("/products/cart", isAuthenticatedUser, getCartProducts);
router.get("/products" , getProducts)
router.get("/products/:id" , getProductDetails )

router.post("/products/review", isAuthenticatedUser, createOrUpdateReview);
router.get("/products/:id/reviews", getProductReviews);

// admin ucun olan xususi rota
router.delete("/admin/products/:id" , isAuthenticatedUser , authorizeRoles("admin") ,  deleteProduct)
router.post("/admin/products" , isAuthenticatedUser , authorizeRoles("admin") , uploadImages, newProduct)
router.put("/admin/products/:id" , isAuthenticatedUser , authorizeRoles("admin") , uploadImages , updateProduct)

export default router