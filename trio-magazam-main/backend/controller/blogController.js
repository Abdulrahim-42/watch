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
  if (blog.images && blog.images.length > 0) {
    for (const img of blog.images) {
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

  const blog = await Blog.create({ ...req.body, images: imageData });
  res.status(201).json({ success: true, blog });
});

// Mövcud blog yazısını yeniləyir; yeni şəkillər varsa, köhnələrini silib yenilərini yükləyir
export const updateBlog = catchAsyncErrors(async (req, res) => {
  const blogId = req.params.id;
  let blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({ error: "Blog tapılmadı" });
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

      blog.images = blog.images.filter(
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
          folder: "blogs",
        });
        newImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
        fs.unlinkSync(file.path);
      } catch (error) {
        return res.status(500).json({
          error: "Şəkil yüklənmədi",
          message: error.message,
        });
      }
    }
  }

  // Məlumatları yenilə
  const updatedData = {
    title: req.body.title ?? blog.title,
    shortContent: req.body.shortContent ?? blog.shortContent,
    content: req.body.content ?? blog.content,
    date: req.body.date ? new Date(req.body.date) : blog.date,
    images: newImages.length > 0 ? [...blog.images, ...newImages] : blog.images,
  };

  blog = await Blog.findByIdAndUpdate(blogId, updatedData, {
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
