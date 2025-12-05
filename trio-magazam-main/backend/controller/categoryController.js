import { Category } from "../model/Category.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Bütün kateqoriyaları gətir
export const getCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    categories,
  });
});

// Tək kateqoriyanı gətir
export const getCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({
      success: false,
      error: "Kateqoriya tapılmadı",
    });
  }
  res.status(200).json({
    success: true,
    category,
  });
});

// Yeni kateqoriya yarat
export const createCategory = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Kateqoriya adı tələb olunur",
    });
  }

  // Eyni adlı kateqoriya yoxdurmu yoxla
  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    return res.status(400).json({
      success: false,
      error: "Bu adlı kateqoriya artıq mövcuddur",
    });
  }

  let imageData = null;

  // Şəkil yükləmək
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "categories",
      });

      imageData = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      // Lokaldakı temp faylı sil
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.error("❌ Şəkil yükləmə xətası:", error);
      return res.status(500).json({
        success: false,
        error: "Şəkil yüklənmədi",
        message: error.message,
      });
    }
  }

  const category = await Category.create({
    name: name.trim(),
    image: imageData,
    subcategories: [],
  });

  res.status(201).json({
    success: true,
    message: "Kateqoriya uğurla yaradıldı",
    category,
  });
});

// Alt kateqoriya əlavə et
export const addSubcategory = catchAsyncErrors(async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Alt kateqoriya adı tələb olunur",
    });
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({
      success: false,
      error: "Kateqoriya tapılmadı",
    });
  }

  // Eyni adlı alt kateqoriya yoxdurmu yoxla
  const existingSubcategory = category.subcategories.find(
    (sub) => sub.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (existingSubcategory) {
    return res.status(400).json({
      success: false,
      error: "Bu adlı alt kateqoriya artıq mövcuddur",
    });
  }

  category.subcategories.push({ name: name.trim() });
  await category.save();

  res.status(200).json({
    success: true,
    message: "Alt kateqoriya uğurla əlavə edildi",
    category,
  });
});

// Kateqoriyanı yenilə
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: "Kateqoriya tapılmadı",
    });
  }

  if (name && name.trim() !== "") {
    // Eyni adlı başqa kateqoriya yoxdurmu yoxla
    const existingCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: req.params.id },
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: "Bu adlı kateqoriya artıq mövcuddur",
      });
    }
    category.name = name.trim();
  }

  // Şəkil yeniləmək
  if (req.file) {
    try {
      // Köhnə şəkli sil
      if (category.image && category.image.public_id) {
        await cloudinary.v2.uploader.destroy(category.image.public_id);
      }

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "categories",
      });

      category.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      // Lokaldakı temp faylı sil
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.error("❌ Şəkil yükləmə xətası:", error);
      return res.status(500).json({
        success: false,
        error: "Şəkil yüklənmədi",
        message: error.message,
      });
    }
  }

  await category.save();

  res.status(200).json({
    success: true,
    message: "Kateqoriya uğurla yeniləndi",
    category,
  });
});

// Alt kateqoriyanı sil
export const deleteSubcategory = catchAsyncErrors(async (req, res, next) => {
  const { categoryId, subcategoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({
      success: false,
      error: "Kateqoriya tapılmadı",
    });
  }

  category.subcategories = category.subcategories.filter(
    (sub) => sub._id.toString() !== subcategoryId
  );
  await category.save();

  res.status(200).json({
    success: true,
    message: "Alt kateqoriya uğurla silindi",
    category,
  });
});

// Kateqoriyanı sil
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: "Kateqoriya tapılmadı",
    });
  }

  // Şəkli sil
  if (category.image && category.image.public_id) {
    await cloudinary.v2.uploader.destroy(category.image.public_id);
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Kateqoriya uğurla silindi",
  });
});

