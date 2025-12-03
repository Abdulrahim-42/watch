import React, { useEffect, useState } from "react";
import {
  useGetBlogsQuery,
  useGetBlogDetailsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "../../redux/api/blogApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminBlogs = () => {
  // Seçilmiş blogun id-sini saxlamaq üçün state
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  // Bütün blogları gətir
  const {
    data: blogsData,
    error: blogsError,
    isLoading: blogsLoading,
    refetch: refetchBlogs,
  } = useGetBlogsQuery();

  // Seçilmiş blogun detallarını gətir (əgər seçim edilməyibsə, sorğu göndərilmir)
  const {
    data: blogDetailData,
    error: blogDetailError,
    isLoading: blogDetailLoading,
  } = useGetBlogDetailsQuery(selectedBlogId, { skip: !selectedBlogId });

  // Blog yeniləmə və silmə mutasiyaları
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  // Redaktə formu üçün state (description əlavə olundu)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  // Yeni yüklənən şəkillər
  const [newImages, setNewImages] = useState([]);
  // Mövcud şəkillərdən silinənləri saxlamaq üçün state
  const [removedImages, setRemovedImages] = useState([]);

  const navigate = useNavigate();

  // Seçilmiş blogun detalları gəldikcə formu yenilə
  useEffect(() => {
    if (blogDetailData && blogDetailData.blog) {
      setFormData({
        title: blogDetailData.blog.title,
        description: blogDetailData.blog.description,
        content: blogDetailData.blog.content,
      });
      // Yeni şəkillər və silinən şəkilləri sıfırla
      setNewImages([]);
      setRemovedImages([]);
    }
  }, [blogDetailData]);

  // Form input dəyişikliyi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Yeni şəkilləri state-ə əlavə et
  const handleNewImagesChange = (e) => {
    setNewImages([...e.target.files]);
  };

  // Mövcud şəkillər üçün silmə/geri alma əməliyyatı
  const handleRemoveExistingImage = (imageId) => {
    if (removedImages.includes(imageId)) {
      setRemovedImages(removedImages.filter((id) => id !== imageId));
    } else {
      setRemovedImages([...removedImages, imageId]);
    }
  };

  // Blog Yeniləmə
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBlogId) return;

    const updatedData = new FormData();
    // Form məlumatlarını əlavə et
    Object.entries(formData).forEach(([key, value]) => {
      updatedData.append(key, value);
    });
    // Yeni şəkilləri əlavə et
    newImages.forEach((image) => {
      updatedData.append("newImages", image);
    });
    // Silinən şəkilləri əlavə et
    removedImages.forEach((imageId) => {
      updatedData.append("removedImages", imageId);
    });

    try {
      await updateBlog({ id: selectedBlogId, blogData: updatedData }).unwrap();
      Swal.fire({
        title: "Uğurlu!",
        text: "Blog uğurla yeniləndi.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setSelectedBlogId(null); // Redaktə rejimindən çıx
        refetchBlogs(); // Siyahını yenilə
      });
    } catch (err) {
      console.error("Xəta:", err);
      Swal.fire({
        title: "Xəta!",
        text: "Blog yenilənərkən xəta baş verdi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Blog Silmə
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu blog silinəcək!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "İmtina",
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(id).unwrap();
        Swal.fire("Silindi!", "Blog uğurla silindi.", "success");
        refetchBlogs();
        // Əgər silinən blog redaktə edilirdisə, redaktə rejimindən çıx
        if (selectedBlogId === id) {
          setSelectedBlogId(null);
        }
      } catch (err) {
        Swal.fire("Xəta!", "Blog silinərkən xəta baş verdi.", "error");
      }
    }
  };

  // Redaktə üçün müvafiq blogu seçir
  const handleEditClick = (id) => {
    setSelectedBlogId(id);
  };

  return (
    <div
      className="
        max-w-4xl mx-auto mt-10 p-6 rounded-md 
        shadow-lg bg-gradient-to-br from-white to-[#fe9034]/5
        flex flex-col gap-8 mt-20
      "
    >
      {/* Başlıq - Mərkəzləşdirilmiş */}
      <h2 className="text-center text-3xl font-extrabold text-[#fe9034]">
        Blog İdarəetməsi
      </h2>

      {/* Mövcud blogların siyahısı */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h3 className="text-center text-xl font-semibold mb-4 text-gray-700">
          Mövcud Blog Yazıları
        </h3>
        {blogsLoading ? (
          <div className="text-center">Yüklənir...</div>
        ) : blogsError ? (
          <div className="text-center text-red-500">
            Xəta: {blogsError.message}
          </div>
        ) : blogsData && blogsData.blogs && blogsData.blogs.length > 0 ? (
          <div className="space-y-4">
            {blogsData.blogs.map((blog) => (
              <div
                key={blog._id}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-semibold text-[#fe9034]">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {blog.content.substring(0, 100)}...
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(blog._id)}
                    className="
                      px-3 py-1 bg-[#fe9034] text-white rounded-md 
                      hover:bg-[#fe9034]/90 transition-colors
                    "
                  >
                    Düzənlə
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="
                      px-3 py-1 bg-red-500 text-white rounded-md 
                      hover:bg-red-600 transition-colors
                    "
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Silinir..." : "Sil"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">Blog tapılmadı.</div>
        )}
      </div>

      {/* Redaktə formu (yalnız bir blog seçildikdə görünür) */}
      {selectedBlogId && (
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-center text-xl font-semibold mb-4 text-gray-700">
            Blogu Düzənlə
          </h3>
          {blogDetailLoading ? (
            <div className="text-center">Yüklənir...</div>
          ) : blogDetailError ? (
            <div className="text-center text-red-500">
              Xəta: {blogDetailError.message}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Başlıq"
                className="
                  w-full p-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring focus:ring-[#fe9034]/50
                "
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Açıqlama"
                className="
                  w-full p-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring focus:ring-[#fe9034]/50
                "
              ></textarea>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Məzmun"
                className="
                  w-full p-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring focus:ring-[#fe9034]/50
                "
              ></textarea>

              {/* Mövcud şəkillər varsa */}
              {blogDetailData &&
                blogDetailData.blog &&
                blogDetailData.blog.image &&
                blogDetailData.blog.image.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {blogDetailData.blog.image.map((img) => (
                      <div key={img.public_id || img.id} className="relative">
                        <img
                          src={img.url}
                          alt={formData.title}
                          className="w-32 h-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveExistingImage(img.public_id || img.id)
                          }
                          className="
                            absolute top-1 right-1 bg-red-500 text-white 
                            px-1 rounded-md text-xs hover:bg-red-600
                          "
                        >
                          {removedImages.includes(img.public_id || img.id)
                            ? "Geri Al"
                            : "Sil"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              <input
                type="file"
                name="newImages"
                multiple
                onChange={handleNewImagesChange}
                className="
                  w-full p-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring focus:ring-[#fe9034]/50
                "
              />

              <div className="flex space-x-2 justify-center">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="
                    px-4 py-2 bg-[#fe9034] text-white rounded-md 
                    hover:bg-[#fe9034]/90 transition-colors
                  "
                >
                  {isUpdating ? "Yenilənir..." : "Yenilə"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBlogId(null)}
                  className="
                    px-4 py-2 bg-gray-400 text-white rounded-md 
                    hover:bg-gray-500 transition-colors
                  "
                >
                  İmtina
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
