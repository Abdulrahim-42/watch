import React, { useState, useEffect } from "react";
import { useAddProductMutation } from "../../redux/api/productsApi";
import { useGetCategoriesQuery } from "../../redux/api/categoryApi";
import { useGetBrandsQuery } from "../../redux/api/brandApi";
import { useGetSpecsQuery } from "../../redux/api/specApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaImage, FaTag, FaInfoCircle, FaUpload, FaStar, FaTrash, FaBoxOpen } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    stock: "",
  });

  // Xüsusiyyətlər üçün state - spec ID-si ilə spec name saxlayacaq
  const [selectedSpecs, setSelectedSpecs] = useState({});

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];
  
  const { data: brandsData } = useGetBrandsQuery();
  const brands = brandsData?.brands || [];

  const { data: specsData } = useGetSpecsQuery();
  const specs = specsData?.specs || [];
  
  // Seçilmiş kateqoriyanın alt kateqoriyalarını tap
  const selectedCategory = categories.find((cat) => cat.name === formData.category);
  const subcategories = selectedCategory?.subcategories || [];

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // Əgər kateqoriya dəyişirsə, alt kateqoriyanı sıfırla
      if (name === "category") {
        return { ...prev, [name]: value, subcategory: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  // Xüsusiyyət seçimi üçün funksiya
  const handleSpecChange = (specId, specName) => {
    setSelectedSpecs(prev => {
      // Əgər spec artıq seçilibsə, sil
      if (prev[specId]) {
        const newSpecs = { ...prev };
        delete newSpecs[specId];
        return newSpecs;
      }
      // Əgər spec seçilməyibsə, əlavə et
      return { ...prev, [specId]: specName };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 6) {
      Swal.fire({
        title: "Xəta!",
        text: "Maksimum 6 şəkil əlavə edə bilərsiniz",
        icon: "warning",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Xəta!",
          text: `${file.name} faylının ölçüsü çox böyükdür (maksimum 5MB)`,
          icon: "warning",
          confirmButtonColor: "#5C4977",
        });
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    if (previews[index] && previews[index].startsWith("blob:")) {
      URL.revokeObjectURL(previews[index]);
    }

    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setImages(newImages);
    setPreviews(newPreviews);

    if (index === mainImageIndex) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex((prev) => prev - 1);
    }
  };

  const setAsMainImage = (index) => {
    setMainImageIndex(index);
  };

  const validateForm = () => {
    const requiredFields = {
      name: "Ad",
      brand: "Brend",
      model: "Model",
      price: "Qiymət",
      description: "Açıqlama",
      category: "Kateqoriya",
      stock: "Stok",
    };

    for (const [field, fieldName] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return `${fieldName} sahəsi tələb olunur`;
      }
    }
    
    // Əgər kateqoriya seçilibsə və alt kateqoriyalar varsa, alt kateqoriya tələb olunur
    if (formData.category && subcategories.length > 0 && !formData.subcategory) {
      return "Alt kateqoriya seçilməlidir";
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      return "Qiymət düzgün formatda olmalıdır";
    }

    if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      return "Stok miqdarı düzgün formatda olmalıdır";
    }

    if (images.length === 0) {
      return "Ən azı bir şəkil əlavə edilməlidir";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      Swal.fire({ 
        title: "Xəta", 
        text: validationError, 
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        // subcategory-ni ayrıca idarə et
        if (key === "subcategory") {
          if (value && value.trim() !== "") {
            formDataToSend.append(key, value.toString().trim());
          }
        } else if (value !== undefined && value !== null && value !== "") {
          formDataToSend.append(key, value.toString());
        }
      });

      // Seçilmiş xüsusiyyətləri əlavə et
      if (Object.keys(selectedSpecs).length > 0) {
        formDataToSend.append("specs", JSON.stringify(selectedSpecs));
      }

      formDataToSend.append("mainImageIndex", mainImageIndex.toString());

      images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const result = await addProduct(formDataToSend).unwrap();

      previews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });

      setFormData({
        name: "",
        brand: "",
        model: "",
        price: "",
        description: "",
        category: "",
        subcategory: "",
        stock: "",
      });
      setSelectedSpecs({});
      setImages([]);
      setPreviews([]);
      setMainImageIndex(0);

      Swal.fire({
        title: "Uğur!",
        text: "Məhsul uğurla əlavə edildi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      }).then(() => {
        navigate("/admin/adminproducts");
      });
    } catch (error) {
      console.error("❌ Xəta baş verdi:", error);

      let errorMessage = "Məhsul əlavə edilərkən xəta baş verdi";

      if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === "FETCH_ERROR") {
        errorMessage = "Serverlə əlaqə problemi. Zəhmət olmasa bir daha yoxlayın.";
      } else if (error?.status === 500) {
        errorMessage = "Server xətası. Məlumatların düzgünlüyünü yoxlayın.";
      }

      Swal.fire({
        title: "Xəta!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Başa düşdüm",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] pt-24 px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Yeni Məhsul Əlavə Et</h1>
              <p className="text-gray-600">Yeni məhsulun məlumatlarını daxil edin</p>
            </div>
            <button
              onClick={() => navigate("/admin/adminproducts")}
              className="text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors border border-[#5C4977] hover:bg-[#5C4977]/5 px-4 py-2 rounded-xl"
            >
              Geri qayıt
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Əsas məlumatlar */}
            <div className="border-b border-[#5C4977]/10 pb-6">
              <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                <FaInfoCircle className="h-5 w-5" />
                Əsas Məlumatlar
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Məhsul Adı *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Məhsul adını daxil edin"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Brend *
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Brend seçin</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Model *
                  </label>
                  <input
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Model adını daxil edin"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Qiymət (AZN) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Qiyməti daxil edin"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Stok Miqdarı *
                  </label>
                  <input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Stok miqdarını daxil edin"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Kateqoriya *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Kateqoriya seçin</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.category && subcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Alt Kateqoriya *
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Alt kateqoriya seçin</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Açıqlama */}
            <div className="border-b border-[#5C4977]/10 pb-6">
              <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                <FaBoxOpen className="h-5 w-5" />
                Açıqlama
              </h2>
              <div>
                <label className="block text-sm font-medium text-[#5C4977] mb-2">
                  Məhsul Haqqında *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Məhsul haqqında ətraflı məlumat yazın..."
                  rows="4"
                  className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            {/* Texniki Xüsusiyyətlər */}
            <div className="border-b border-[#5C4977]/10 pb-6">
              <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                <FaTag className="h-5 w-5" />
                Xüsusiyyətlər (Seçmək üçün klikləyin)
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {specs.map((spec) => (
                    <button
                      key={spec._id}
                      type="button"
                      onClick={() => handleSpecChange(spec._id, spec.name)}
                      className={`p-3 border rounded-xl text-left transition-all duration-200 ${
                        selectedSpecs[spec._id]
                          ? 'bg-[#5C4977] text-white border-[#5C4977]'
                          : 'border-[#5C4977]/20 hover:border-[#5C4977] hover:bg-[#5C4977]/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{spec.name}</span>
                        {selectedSpecs[spec._id] && (
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            Seçildi
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {specs.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Xüsusiyyət yoxdur. Admin panelindən xüsusiyyət əlavə edin.
                  </p>
                )}
                {Object.keys(selectedSpecs).length > 0 && (
                  <div className="mt-4 p-4 bg-[#5C4977]/5 rounded-xl">
                    <p className="text-sm font-medium text-[#5C4977] mb-2">
                      Seçilmiş Xüsusiyyətlər:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedSpecs).map(([specId, specName]) => (
                        <span
                          key={specId}
                          className="inline-flex items-center gap-1 bg-[#5C4977] text-white px-3 py-1 rounded-full text-sm"
                        >
                          {specName}
                          <button
                            type="button"
                            onClick={() => handleSpecChange(specId, specName)}
                            className="ml-1 hover:text-red-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Şəkillər */}
            <div className="pb-6">
              <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                <FaImage className="h-5 w-5" />
                Məhsul Şəkilləri
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#5C4977] mb-3">
                  Şəkilləri seçin (Maksimum 6 şəkil)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={images.length >= 6}
                    className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 disabled:opacity-50 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <HiOutlinePhotograph className="h-5 w-5 text-[#5C4977]/60" />
                  </div>
                </div>
              </div>

              {/* Əsas Şəkil */}
              {previews.length > 0 && (
                <div className="mb-6 p-4 border-2 border-green-500 rounded-xl bg-green-50">
                  <div className="flex items-center gap-4">
                    <img
                      src={previews[mainImageIndex]}
                      alt="Əsas şəkil"
                      className="w-32 h-32 object-cover border-2 border-green-500 rounded-lg shadow-md"
                    />
                    <div>
                      <div className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                        <FaStar className="h-3 w-3" />
                        Əsas Şəkil
                      </div>
                      <p className="text-sm text-gray-600">
                        Bu şəkil məhsulun ön şəkili kimi göstəriləcək
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Şəkil Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {previews.length > 0 ? (
                  previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border-2 border-[#5C4977]/20 group-hover:border-[#5C4977]/40 transition-colors">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {index === mainImageIndex && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Əsas
                        </div>
                      )}

                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index !== mainImageIndex && (
                          <button
                            type="button"
                            onClick={() => setAsMainImage(index)}
                            className="bg-[#5C4977] hover:bg-[#5C4977]/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md"
                            title="Əsas şəkil et"
                          >
                            <FaStar className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md"
                          title="Sil"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#5C4977]/20 rounded-xl bg-[#5C4977]/5">
                    <FaImage className="h-12 w-12 text-[#5C4977]/40 mb-4" />
                    <p className="text-[#5C4977]/70 text-center">
                      Heç bir şəkil əlavə edilməyib
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  {previews.length}/6 şəkil əlavə edilib • Maksimum ölçü: 5MB
                </p>
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  disabled={images.length >= 6}
                  className="text-sm text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors disabled:opacity-50"
                >
                  <FaUpload className="inline mr-1 h-4 w-4" />
                  Şəkil əlavə et
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Məhsul əlavə edilir...
                </div>
              ) : (
                'Məhsulu Əlavə Et'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 META SHOP Admin Panel. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;