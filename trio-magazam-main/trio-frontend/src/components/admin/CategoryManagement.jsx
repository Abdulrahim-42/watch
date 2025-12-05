import React, { useState } from "react";
import { useGetCategoriesQuery, useCreateCategoryMutation, useAddSubcategoryMutation, useDeleteCategoryMutation, useDeleteSubcategoryMutation } from "../../redux/api/categoryApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaImage, FaTag, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CategoryManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [addSubcategory, { isLoading: isAddingSub }] = useAddSubcategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubcategory] = useDeleteSubcategoryMutation();

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: null,
    imagePreview: null,
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
  });

  const categories = data?.categories || [];

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Xəta!",
          text: "Şəkil ölçüsü maksimum 5MB olmalıdır",
          icon: "warning",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
      setCategoryForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!categoryForm.name.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Kateqoriya adı tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryForm.name.trim());
      if (categoryForm.image) {
        formData.append("image", categoryForm.image);
      }

      await createCategory(formData).unwrap();

      Swal.fire({
        title: "Uğur!",
        text: "Kateqoriya uğurla əlavə edildi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      });

      setCategoryForm({ name: "", image: null, imagePreview: null });
      setShowAddCategoryModal(false);
      refetch();
    } catch (error) {
      console.error("Xəta:", error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Kateqoriya əlavə edilərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();

    if (!subcategoryForm.name.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Alt kateqoriya adı tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      await addSubcategory({
        categoryId: selectedCategoryId,
        name: subcategoryForm.name.trim(),
      }).unwrap();

      Swal.fire({
        title: "Uğur!",
        text: "Alt kateqoriya uğurla əlavə edildi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      });

      setSubcategoryForm({ name: "" });
      setShowAddSubcategoryModal(false);
      setSelectedCategoryId(null);
      refetch();
    } catch (error) {
      console.error("Xəta:", error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Alt kateqoriya əlavə edilərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu kateqoriyanı silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(categoryId).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Kateqoriya uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Kateqoriya silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu alt kateqoriyanı silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deleteSubcategory({
          categoryId,
          subcategoryId,
        }).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Alt kateqoriya uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Alt kateqoriya silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  const openAddSubcategoryModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowAddSubcategoryModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] pt-24 px-4 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Kateqoriya İdarəetməsi</h1>
              <p className="text-gray-600">Ana kateqoriyalar və alt kateqoriyaları idarə edin</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/admin/admin-dashboard")}
                className="text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors border border-[#5C4977] hover:bg-[#5C4977]/5 px-4 py-2 rounded-xl"
              >
                Geri qayıt
              </button>
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="bg-[#5C4977] text-white hover:bg-[#5C4977]/90 font-medium transition-colors px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <FaPlus className="h-4 w-4" />
                Yeni Kateqoriya
              </button>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 md:p-8">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FaTag className="h-16 w-16 text-[#5C4977]/30 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Heç bir kateqoriya yoxdur</p>
              <p className="text-gray-500 text-sm mt-2">İlk kateqoriyanı əlavə edin</p>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="border border-[#5C4977]/20 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      {category.image?.url ? (
                        <img
                          src={category.image.url}
                          alt={category.name}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-[#5C4977]/20"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-[#5C4977]/10 rounded-lg flex items-center justify-center">
                          <FaImage className="h-8 w-8 text-[#5C4977]/40" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-[#5C4977]">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          {category.subcategories?.length || 0} alt kateqoriya
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openAddSubcategoryModal(category._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <FaPlus className="h-3 w-3" />
                        Alt Kateqoriya
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <FaTrash className="h-3 w-3" />
                        Sil
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-4 pl-24">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {category.subcategories.map((subcategory) => (
                          <div
                            key={subcategory._id}
                            className="bg-[#5C4977]/5 border border-[#5C4977]/20 rounded-lg p-3 flex items-center justify-between"
                          >
                            <span className="text-[#5C4977] font-medium">{subcategory.name}</span>
                            <button
                              onClick={() =>
                                handleDeleteSubcategory(category._id, subcategory._id)
                              }
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Sil"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#5C4977]">Yeni Kateqoriya</h2>
                <button
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setCategoryForm({ name: "", image: null, imagePreview: null });
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Yeni bir ana kateqoriya adı daxil edin
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={categoryForm.name}
                    onChange={handleCategoryInputChange}
                    placeholder="Məs. Sırğalar"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Şəkil 1
                  </label>
                  <div className="border-2 border-dashed border-[#5C4977]/30 rounded-xl p-6 text-center">
                    {categoryForm.imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={categoryForm.imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryForm((prev) => ({
                              ...prev,
                              image: null,
                              imagePreview: null,
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Şəkli sil
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaImage className="h-12 w-12 text-[#5C4977]/40 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">*Файл не выбран</p>
                        <label className="inline-block cursor-pointer">
                          <span className="bg-[#5C4977] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5C4977]/90 transition-colors">
                            Şəkil Seç
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCategoryImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCategoryModal(false);
                      setCategoryForm({ name: "", image: null, imagePreview: null });
                    }}
                    className="flex-1 border border-[#5C4977]/20 text-[#5C4977] hover:bg-[#5C4977]/5 font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 bg-[#5C4977] text-white hover:bg-[#5C4977]/90 font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "Yadda saxlanır..." : "Yadda saxla"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Subcategory Modal */}
        {showAddSubcategoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#5C4977]">Alt Kateqoriya Əlavə Et</h2>
                <button
                  onClick={() => {
                    setShowAddSubcategoryModal(false);
                    setSubcategoryForm({ name: "" });
                    setSelectedCategoryId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubcategorySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Alt kateqoriya adı
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={subcategoryForm.name}
                    onChange={(e) =>
                      setSubcategoryForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Alt kateqoriya adını daxil edin"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSubcategoryModal(false);
                      setSubcategoryForm({ name: "" });
                      setSelectedCategoryId(null);
                    }}
                    className="flex-1 border border-[#5C4977]/20 text-[#5C4977] hover:bg-[#5C4977]/5 font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingSub}
                    className="flex-1 bg-[#5C4977] text-white hover:bg-[#5C4977]/90 font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingSub ? "Əlavə edilir..." : "Əlavə et"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;

