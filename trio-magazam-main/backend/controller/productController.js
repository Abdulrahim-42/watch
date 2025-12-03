// src/controller/productController.js
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { Product } from "../model/Product.js";
import cloudinary from "../utils/cloudinary.js";
import ErrorHandler from "../utils/errorHandler.js";
import fs from "fs";

/**
 * Məhsulları əldə etmək
 */
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  if (!products) {
    return next(new ErrorHandler("Məhsullar yoxdur", 404));
  }

  res.status(200).json({
    success: true,
    products,
  });
});

/**
 * Məhsul detalları
 */
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Məhsul tapilmadi", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/**
 * Məhsulu silmək
 */
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Məhsul tapilmadi",
      });
    }

    // Cloudinary'dən şəkilləri silmək
    if (product.images && product.images.length > 0) {
      for (let image of product.images) {
        try {
          await cloudinary.v2.uploader.destroy(image.public_id);
        } catch (cloudinaryError) {
          console.error(
            `Cloudinary-dən ${image.public_id} id-li şəkil silinərkən xəta:`,
            cloudinaryError
          );
        }
      }
    }

    await Product.deleteOne({ _id: req?.params?.id });

    return res.status(200).json({
      success: true,
      message: "Məhsul uğurla silindi",
    });
  } catch (error) {
    console.error("deleteProduct funksiyasında xəta baş verdi:", error);
    return res.status(500).json({
      success: false,
      error: "Daxili server xətası",
      message: error.message,
    });
  }
});

/**
 * Yeni məhsul yaratmaq
 * FRONTEND: AddProduct.jsx -> FormData ilə göndərilir
 * seller ARTIQ TƏLƏB OLUNMUR
 * specs -> sadə string kimi saxlanılır
 */
export const newProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log("📥 Yeni məhsul sorğusu alındı");
    console.log("Body:", req.body);
    console.log("Fayllar:", req.files);

    // ✅ Artıq seller yoxdur
    const requiredFields = [
      "name",
      "brand",
      "model",
      "price",
      "description",
      "category",
      "stock",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        !req.body[field] || req.body[field].toString().trim().length === 0
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Aşağıdakı sahələr tələb olunur: ${missingFields.join(", ")}`,
      });
    }

    const images = [];

    // Şəkil yükləmək
    if (req.files && req.files.length > 0) {
      console.log(`📸 ${req.files.length} şəkil yüklənir...`);
      for (let file of req.files) {
        try {
          const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: "products",
          });

          images.push({
            public_id: result.public_id,
            url: result.secure_url,
          });

          console.log(`✅ Şəkil yükləndi: ${result.public_id}`);

          // Lokaldakı temp faylı sil
          fs.unlinkSync(file.path);
        } catch (error) {
          console.error("❌ Şəkil yükləmə xətası:", error);
          return res.status(500).json({
            success: false,
            error: "Şəkil yüklənmədi",
            message: error.message,
          });
        }
      }
    }

    // 🔧 Specs – sadə text kimi (textarea-dan gəlir)
    // Frontend: formDataToSend.append("specs", string);
    const specs = req.body.specs || "";

    // Məhsul məlumatlarını hazırlamaq
    const productData = {
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      price: Number(req.body.price),
      description: req.body.description,
      category: req.body.category,
      stock: Number(req.body.stock),
      specs: specs, // string
      images: images,
      user: req.user?._id, // auth varsa
      // seller yoxdur artıq
    };

    console.log("🎯 Yaradılacaq məhsul:", productData);

    const product = await Product.create(productData);
    console.log("✅ Məhsul uğurla yaradıldı:", product._id);

    res.status(201).json({
      success: true,
      message: "Məhsul uğurla yaradıldı",
      product,
    });
  } catch (error) {
    console.error("❌ newProduct xətası:", error);
    return res.status(500).json({
      success: false,
      error: "Məhsul yaradılarkən xəta baş verdi",
      message: error.message,
    });
  }
});

/**
 * Məhsulu yeniləmək
 */
export const updateProduct = catchAsyncErrors(async (req, res) => {
  const productId = req.params.id;

  let product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: "Məhsul tapılmadı",
    });
  }

  // Silinəcək şəkillər
  if (req.body.removedImages) {
    let removedImagesArray;

    if (typeof req.body.removedImages === "string") {
      removedImagesArray = [req.body.removedImages];
    } else if (Array.isArray(req.body.removedImages)) {
      removedImagesArray = req.body.removedImages;
    }

    if (removedImagesArray && removedImagesArray.length > 0) {
      for (let publicId of removedImagesArray) {
        try {
          await cloudinary.v2.uploader.destroy(publicId);
        } catch (error) {
          console.error(`Şəkil silinərkən xəta (${publicId}):`, error);
        }
      }

      product.images = product.images.filter(
        (img) => !removedImagesArray.includes(img.public_id)
      );
    }
  }

  // Yeni şəkilləri yüklə
  const newImages = [];
  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      try {
        const result = await cloudinary.v2.uploader.upload(file.path, {
          folder: "products",
        });
        newImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
        fs.unlinkSync(file.path);
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: "Şəkil yüklənmədi",
          message: error.message,
        });
      }
    }
  }

  // 🔧 Specs – string kimi güncəllə
  let specs = product.specs;
  if (typeof req.body.specs === "string") {
    specs = req.body.specs;
  }

  // Məhsul məlumatlarını yenilə
  const updatedData = {
    name: req.body.name ?? product.name,
    brand: req.body.brand ?? product.brand,
    model: req.body.model ?? product.model,
    price:
      req.body.price !== undefined
        ? Number(req.body.price)
        : product.price,
    description: req.body.description ?? product.description,
    category: req.body.category ?? product.category,
    stock:
      req.body.stock !== undefined
        ? Number(req.body.stock)
        : product.stock,
    specs: specs,
    // seller artıq yoxdur
  };

  if (newImages.length > 0) {
    updatedData.images = [...product.images, ...newImages];
  } else {
    updatedData.images = product.images;
  }

  product = await Product.findByIdAndUpdate(productId, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(500).json({
      success: false,
      error: "Məhsul yenilənmədi",
    });
  }

  res.status(200).json({
    success: true,
    message: "Məhsul uğurla yeniləndi",
    product,
  });
});

/**
 * Məhsullar üzərində axtarış
 */
export const searchProducts = catchAsyncErrors(async (req, res, next) => {
  const { query, page = 1, limit = 10 } = req.query;

  if (!query) {
    return next(new ErrorHandler("Axtarış sorğusu daxil edin.", 400));
  }

  const searchRegex = new RegExp(query, "i");

  const products = await Product.find({
    $or: [
      { name: { $regex: searchRegex } },
      { brand: { $regex: searchRegex } },
      { model: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { category: { $regex: searchRegex } },
    ],
  })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalProducts = await Product.countDocuments({
    $or: [
      { name: { $regex: searchRegex } },
      { brand: { $regex: searchRegex } },
      { model: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { category: { $regex: searchRegex } },
    ],
  });

  if (products.length === 0) {
    return next(
      new ErrorHandler("Axtarışınıza uyğun məhsul tapılmadı.", 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Axtarış nəticələri uğurla gətirildi.",
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: parseInt(page),
  });
});

/**
 * Rəy əlavə etmək və ya yeniləmək
 */
export const createOrUpdateReview = catchAsyncErrors(
  async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Məhsul tapılmadı", 404));
    }

    const review = {
      user: req.user ? req.user._id : req.body.user,
      rating: Number(rating),
      comment,
    };

    const existingReviewIndex = product.reviews.findIndex(
      (rev) => rev.user.toString() === review.user.toString()
    );

    if (existingReviewIndex !== -1) {
      product.reviews[existingReviewIndex].rating = review.rating;
      product.reviews[existingReviewIndex].comment = review.comment;
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    if (product.reviews.length > 0) {
      product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.ratings = 0;
    }

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Rəy uğurla əlavə edildi/güncəlləndi",
    });
  }
);

/**
 * Məhsul rəylərini əldə etmək
 */
export const getProductReviews = catchAsyncErrors(
  async (req, res, next) => {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("Məhsul tapılmadı", 404));
    }

    res.status(200).json({
      success: true,
      message: "Məhsulun rəyləri uğurla gətirildi",
      reviews: product.reviews,
      ratings: product.ratings,
      numOfReviews: product.numOfReviews,
    });
  }
);
