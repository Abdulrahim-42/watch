import Brand from "../model/Brand.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

// Bütün brendləri gətir
export const getBrands = catchAsyncErrors(async (req, res, next) => {
  const brands = await Brand.find().sort({ name: 1 });
  res.status(200).json({
    success: true,
    brands,
  });
});

// Tək brendi gətir
export const getBrand = catchAsyncErrors(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return res.status(404).json({
      success: false,
      error: "Brend tapılmadı",
    });
  }
  res.status(200).json({
    success: true,
    brand,
  });
});

// Yeni brend yarat
export const createBrand = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Brend adı tələb olunur",
    });
  }

  // Eyni adlı brend yoxdurmu yoxla
  const existingBrand = await Brand.findOne({ name: name.trim() });
  if (existingBrand) {
    return res.status(400).json({
      success: false,
      error: "Bu adlı brend artıq mövcuddur",
    });
  }

  const brand = await Brand.create({
    name: name.trim(),
  });

  res.status(201).json({
    success: true,
    message: "Brend uğurla yaradıldı",
    brand,
  });
});

// Brendi yenilə
export const updateBrand = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      error: "Brend tapılmadı",
    });
  }

  if (name && name.trim() !== "") {
    // Eyni adlı başqa brend yoxdurmu yoxla
    const existingBrand = await Brand.findOne({
      name: name.trim(),
      _id: { $ne: req.params.id },
    });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        error: "Bu adlı brend artıq mövcuddur",
      });
    }
    brand.name = name.trim();
  }

  await brand.save();

  res.status(200).json({
    success: true,
    message: "Brend uğurla yeniləndi",
    brand,
  });
});

// Brendi sil
export const deleteBrand = catchAsyncErrors(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      error: "Brend tapılmadı",
    });
  }

  await Brand.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Brend uğurla silindi",
  });
});

