import Spec from "../model/Spec.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

// Bütün xüsusiyyətləri gətir
export const getSpecs = catchAsyncErrors(async (req, res, next) => {
  const specs = await Spec.find().sort({ name: 1 });
  res.status(200).json({
    success: true,
    specs,
  });
});

// Tək xüsusiyyəti gətir
export const getSpec = catchAsyncErrors(async (req, res, next) => {
  const spec = await Spec.findById(req.params.id);
  if (!spec) {
    return res.status(404).json({
      success: false,
      error: "Xüsusiyyət tapılmadı",
    });
  }
  res.status(200).json({
    success: true,
    spec,
  });
});

// Yeni xüsusiyyət yarat
export const createSpec = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Xüsusiyyət adı tələb olunur",
    });
  }

  // Eyni adlı xüsusiyyət yoxdurmu yoxla
  const existingSpec = await Spec.findOne({ name: name.trim() });
  if (existingSpec) {
    return res.status(400).json({
      success: false,
      error: "Bu adlı xüsusiyyət artıq mövcuddur",
    });
  }

  const spec = await Spec.create({
    name: name.trim(),
  });

  res.status(201).json({
    success: true,
    message: "Xüsusiyyət uğurla yaradıldı",
    spec,
  });
});

// Xüsusiyyəti yenilə
export const updateSpec = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  const spec = await Spec.findById(req.params.id);

  if (!spec) {
    return res.status(404).json({
      success: false,
      error: "Xüsusiyyət tapılmadı",
    });
  }

  if (name && name.trim() !== "") {
    // Eyni adlı başqa xüsusiyyət yoxdurmu yoxla
    const existingSpec = await Spec.findOne({
      name: name.trim(),
      _id: { $ne: req.params.id },
    });
    if (existingSpec) {
      return res.status(400).json({
        success: false,
        error: "Bu adlı xüsusiyyət artıq mövcuddur",
      });
    }
    spec.name = name.trim();
  }

  await spec.save();

  res.status(200).json({
    success: true,
    message: "Xüsusiyyət uğurla yeniləndi",
    spec,
  });
});

// Xüsusiyyəti sil
export const deleteSpec = catchAsyncErrors(async (req, res, next) => {
  const spec = await Spec.findById(req.params.id);

  if (!spec) {
    return res.status(404).json({
      success: false,
      error: "Xüsusiyyət tapılmadı",
    });
  }

  await Spec.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Xüsusiyyət uğurla silindi",
  });
});

