import mongoose from "mongoose";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Favorite from "../model/Favorite.js";
import {Product} from "../model/Product.js";
import ErrorHandler from "../utils/errorHandler.js";

// Favorilərə əlavə etmə
export const addToFavorites = catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        // Məhsul ID-sinin düzgünlüyünü yoxla
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new ErrorHandler("Yanlış məhsul ID-si.", 400);
        }

        // Məhsulu bazadan tap
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Hal-hazırda məhsul mövcud deyil.", 404));
        }

        // İstifadəçinin favori siyahısını tap və ya yenisini yarat
        let favorite = await Favorite.findOne({ user: userId });
        if (!favorite) {
            favorite = new Favorite({ user: userId, products: [] });
        }

        // Məhsul artıq favoridədirmi yoxla
        const productIndex = favorite.products.findIndex(
            (p) => p.toString() === productId
        );

        if (productIndex !== -1) {
            return next(new ErrorHandler("Məhsul artıq favorilərinizdədir.", 400));
        }

        // Məhsulu favorilərə əlavə et
        favorite.products.push(productId);
        await favorite.save();

        res.status(200).json({
            success: true,
            message: "Məhsul favorilərə əlavə edildi.",
            favorite,
        });
    } catch (error) {
        next(error);
    }
});

// Favorilərdən məhsul silmə
export const removeFromFavorites = catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        // İstifadəçinin favori siyahısını tap
        let favorite = await Favorite.findOne({ user: userId });
        if (!favorite) {
            return next(new ErrorHandler("Hal-hazırda məhsul mövcud deyil.", 404));
        }

        // Məhsul favoridədirmi yoxla
        const productIndex = favorite.products.findIndex(
            (p) => p.toString() === productId
        );

        if (productIndex === -1) {
            return next(new ErrorHandler("Hal-hazırda məhsul mövcud deyil.", 404));
        }

        // Məhsulu siyahıdan sil
        favorite.products.splice(productIndex, 1);

        // Əgər favori siyahısı tam boşdursa, siyahını sil
        if (favorite.products.length === 0) {
            await Favorite.findOneAndDelete({ user: userId });
            return res.status(200).json({
                success: true,
                message: "Məhsul favorilərdən silindi və favori siyahısı tam silindi.",
            });
        }

        await favorite.save();

        res.status(200).json({
            success: true,
            message: "Məhsul favorilərdən silindi.",
            favorite,
        });
    } catch (error) {
        next(error);
    }
});

// Favoridəki məhsulları gətir
export const getFavoriteProducts = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;

    try {
        const favorite = await Favorite.findOne({ user: userId }).populate({
            path: "products",
            select: "name price images",
        });

        if (!favorite) {
            return next(new ErrorHandler("Hal-hazırda məhsul mövcud deyil.", 404));
        }

        res.status(200).json({
            success: true,
            favorites: favorite.products,
        });
    } catch (error) {
        next(error);
    }
});