import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

import cloudinary from "../utils/cloudinary.js";
import ErrorHandler from "../utils/errorHandler.js";
import fs from "fs";
import Blog from "../model/Blog.js";

// Bütün blog yazılarını gətirir
export const getBlogs = catchAsyncErrors(async (req, res, next) => {
  const blogs = await Blog.find();
  if (!blogs) {
    return next(new ErrorHandler("Blog yazısı yoxdur", 404));  // ErrorHandler-i düzgün çağırdığınızdan əmin olun
  }
  res.status(200).json({ blogs });
});

// Seçilmiş blog yazısının detallarını gətirir
export const getBlogDetails = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorHandler("Blog tapılmadı", 404));
  }
  res.status(200).json({ blog });
});

// Blog yazısını silir (əgər şəkil varsa, Cloudinary-dən də silinir)
export const deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: "Blog tapılmadı" });
  }

  // Əgər blog yazısında şəkil varsa, bütün şəkilləri Cloudinary-dən silirik
  if (blog.image && blog.image.length > 0) {
    for (const img of blog.image) {
      await cloudinary.v2.uploader.destroy(img.public_id);
    }
  }

  await Blog.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Blog uğurla silindi" });
});

// Yeni blog yazısı yaradır və varsa şəkilləri Cloudinary-yə yükləyir
export const newBlog = catchAsyncErrors(async (req, res, next) => {
  let imageData = [];

  // Şəkillər yüklənibsə, hər birini Cloudinary-ə göndəririk
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const result = await cloudinary.v2.uploader.upload(file.path, {
          folder: "blogs",
        });
        imageData.push({ public_id: result.public_id, url: result.secure_url });
        // Yükləndikdən sonra müvəqqəti faylı silirik
        fs.unlinkSync(file.path);
      } catch (error) {
        return res.status(500).json({
          error: "Şəkil yüklənmədi",
          message: error.message,
        });
      }
    }
  }

  const blog = await Blog.create({ ...req.body, image: imageData });
  res.status(201).json({ success: true, blog });
});

// Mövcud blog yazısını yeniləyir; yeni şəkillər varsa, köhnələrini silib yenilərini yükləyir
export const updateBlog = catchAsyncErrors(async (req, res) => {
  const blogId = req.params.id;
  let blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({ error: "Blog tapılmadı" });
  }

  // Əgər yeni şəkillər göndərilibsə, köhnə şəkilləri Cloudinary-dən silirik və yenilərini yükləyirik
  if (req.files && req.files.length > 0) {
    // Köhnə şəkilləri silirik
    if (blog.image && blog.image.length > 0) {
      for (const img of blog.image) {
        await cloudinary.v2.uploader.destroy(img.public_id);
      }
    }
    let imageData = [];
    for (const file of req.files) {
      try {
        const result = await cloudinary.v2.uploader.upload(file.path, {
          folder: "blogs",
        });
        imageData.push({ public_id: result.public_id, url: result.secure_url });
        fs.unlinkSync(file.path);
      } catch (error) {
        return res.status(500).json({
          error: "Şəkil yüklənmədi",
          message: error.message,
        });
      }
    }
    req.body.image = imageData;
  }

  blog = await Blog.findByIdAndUpdate(blogId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    return res.status(500).json({ error: "Blog yenilənmədi" });
  }
  res.status(200).json({
    success: true,
    message: "Blog uğurla yeniləndi",
    blog,
  });
});
