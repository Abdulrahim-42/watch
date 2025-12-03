import mongoose from "mongoose";
import Cart from "../model/Cart.js";
import {Product} from "../model/Product.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

export const addToCart = catchAsyncErrors( async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    // Ürün ID'sinin geçerliliğini kontrol et
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ErrorHandler("Geçersiz ürün ID'si.", 400);
    }

    // Ürünü veritabanından bul
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Şu anda ürün bulunmamaktadır.", 404))
    }

    // Kullanıcının sepetini bul veya yeni sepet oluştur
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    // Sepette bu ürün var mı kontrol et
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex !== -1) {
      // Ürün sepette varsa, miktarını artır
      cart.products[productIndex].quantity += quantity;
    } else {
      // Ürün sepette yoksa, yeni bir obje olarak ekle
      cart.products.push({ product: productId, quantity });
    }

    // Sepeti kaydet
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Ürün sepete eklendi.",
      cart,
    });
  } catch (error) {
    next(error);
  }
});

// Sepetten ürün kaldırma
export const removeFromCart =catchAsyncErrors( async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    // Kullanıcının sepetini bul
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(new ErrorHandler("Şu anda ürün bulunmamaktadır.", 404))
    }

    // Sepette bu ürün var mı kontrol et
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      return next(new ErrorHandler("Şu anda ürün bulunmamaktadır.", 404))
    }

    // Ürünü listeden kaldır
    cart.products.splice(productIndex, 1);

    // Eğer sepet tamamen boşaldıysa, sepeti sil
    if (cart.products.length === 0) {
      await Cart.findOneAndDelete({ user: userId });
      return res.status(200).json({
        success: true,
        message: "Ürün sepetten kaldırıldı ve sepet tamamen silindi.",
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Ürün sepetten kaldırıldı.",
      cart,
    });
  } catch (error) {
    next(error);
  }
});

// Sepetteki ürünleri getir
export const getCartProducts = catchAsyncErrors( async (req, res, next) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      select: "name price images"
    });

    if (!cart) {
      return next(new ErrorHandler("Şu anda ürün bulunmamaktadır.", 404))
    }

    res.status(200).json({
      success: true,
      cart: cart.products,
    });
  } catch (error) {
    next(error);
  }
});

// controllers/cartController.js

export const updateCartQuantity = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  try {
      // Məhsulun stock-unu yoxla
      const product = await Product.findById(productId);
      if (!product) {
          return next(new ErrorHandler("Məhsul tapılmadı", 404));
      }

      // Stock limitini yoxla
      if (quantity > product.stock) {
          return next(new ErrorHandler("Kifayət qədər stok yoxdur", 400));
      }

      // Minimum miqdar yoxlaması
      if (quantity < 1) {
          return next(new ErrorHandler("Miqdar 1-dən az ola bilməz", 400));
      }

      // Səbəti tap və yenilə
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
          return next(new ErrorHandler("Səbət tapılmadı", 404));
      }

      const productIndex = cart.products.findIndex(
          (p) => p.product.toString() === productId
      );

      if (productIndex === -1) {
          return next(new ErrorHandler("Məhsul səbətdə tapılmadı", 404));
      }

      // Miqdarı yenilə
      cart.products[productIndex].quantity = quantity;
      await cart.save();

      // Yenilənmiş səbəti qaytar
      const updatedCart = await Cart.findOne({ user: userId }).populate({
          path: "products.product",
          select: "name price image stock"
      });

      res.status(200).json({
          success: true,
          message: "Məhsul miqdarı yeniləndi",
          cart: updatedCart.products
      });
  } catch (error) {
      next(error);
  }
});
