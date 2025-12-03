import React, { useState } from "react";
import {
  useCreateBlogMutation,
  useGetBlogsQuery,
} from "../../redux/api/blogApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddBlogs = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });
  const [images, setImages] = useState([]);
  const [createBlog] = useCreateBlogMutation();
  const { refetch } = useGetBlogsQuery(); // Blog siyahısını yeniləmək üçün
  const navigate = useNavigate();

  // Form input dəyişikliklərini state-ə ötür
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Şəkil seçimi dəyişikliklərini tut
  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  // Form göndərmə
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    // Formdakı məlumatları FormData-ya əlavə et
    for (let key in formData) {
      form.append(key, formData[key]);
    }
    // Seçilən şəkilləri əlavə et
    for (let i = 0; i < images.length; i++) {
      form.append("newImages", images[i]);
    }

    try {
      await createBlog(form).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Blog uğurla əlavə olundu.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Blog əlavə edildikdən sonra yönləndirmə (məsələn: /admin/adminblogs)
      navigate("/admin/adminblogs");

      // Blog siyahısını yeniləmək üçün refetch çağırılır
      await refetch();

      // Formu sıfırla
      setFormData({
        title: "",
        description: "",
        content: "",
      });
      setImages([]);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Xəta!",
        text: "Blog əlavə edilərkən xəta baş verdi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div
      className="
        max-w-4xl mx-auto mt-10 p-6 rounded-md 
        shadow-lg bg-gradient-to-br from-white to-[#fe9034]/5
        flex flex-col gap-8
      "
    >
      <div className="bg-white p-4 rounded-md shadow-sm w-full">
        {/* Başlıq - Mərkəzləşdirilmiş */}
        <h2 className="text-center text-3xl font-extrabold text-[#fe9034] mb-6">
          Yeni Blog Əlavə Et
        </h2>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <input
            type="text"
            name="title"
            placeholder="Başlıq"
            value={formData.title}
            onChange={handleInputChange}
            className="
              w-full p-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring focus:ring-[#fe9034]/50
            "
          />

          <textarea
            name="description"
            placeholder="Açıqlama"
            value={formData.description}
            onChange={handleInputChange}
            className="
              w-full p-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring focus:ring-[#fe9034]/50
            "
          ></textarea>

          <textarea
            name="content"
            placeholder="Məzmun"
            value={formData.content}
            onChange={handleInputChange}
            className="
              w-full p-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring focus:ring-[#fe9034]/50
            "
          ></textarea>

          <input
            type="file"
            name="newImages"
            multiple
            onChange={handleFileChange}
            className="
              w-full p-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring focus:ring-[#fe9034]/50
            "
          />

          <button
            type="submit"
            className="
              w-full py-2 bg-[#fe9034] text-white rounded-md 
              hover:bg-[#fe9034]/90 transition-colors
            "
          >
            Əlavə Et
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlogs;
