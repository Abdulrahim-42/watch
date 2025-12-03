import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductDetailsQuery, 
  useEditProductMutation, 
  useGetProductsQuery 
} from '../../redux/api/productsApi';
import Swal from 'sweetalert2';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetProductDetailsQuery(id);
  const { refetch } = useGetProductsQuery();
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();

  const categories = [
    "Phone", "Laptop", "Tablet", "TV", "Headphones", 
    "Smartwatch", "Console", "Camera", "Accessory"
  ];

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    price: '',
    description: '',
    category: '',
    seller: '',
    stock: '',
  });

  const [specsInput, setSpecsInput] = useState([{ key: "", value: "" }]);
  const [images, setImages] = useState([]); // Yeni şəkillər
  const [previews, setPreviews] = useState([]); // Bütün preview-lər
  const [removedImages, setRemovedImages] = useState([]); // Silinəcək şəkillər
  const [mainImageIndex, setMainImageIndex] = useState(0); // Əsas şəkil indeksi

  useEffect(() => {
    if (data?.product) {
      const product = data.product;
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        model: product.model || '',
        price: product.price || '',
        description: product.description || '',
        category: product.category || '',
        seller: product.seller || '',
        stock: product.stock || '',
      });

      // Specs-i doldur
      if (product.specs && typeof product.specs === 'object') {
        const specsArray = Object.entries(product.specs).map(([key, value]) => ({
          key,
          value: String(value)
        }));
        setSpecsInput(specsArray.length > 0 ? specsArray : [{ key: "", value: "" }]);
      }

      // Mövcud şəkilləri preview kimi saxla
      if (product.images && product.images.length > 0) {
        setPreviews(product.images.map(img => img.url));
        // Əsas şəkili serverdən ala bilərsiniz, əgər saxlanılıbsa
        // Əks halda default 0
        setMainImageIndex(0);
      }
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    // Maksimum 6 şəkil limiti
    const totalImages = previews.length - removedImages.length + files.length;
    if (totalImages > 6) {
      Swal.fire({
        title: "Xəta!",
        text: "Maksimum 6 şəkil ola bilər",
        icon: "warning"
      });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Xəta!",
          text: `${file.name} faylının ölçüsü çox böyükdür (maksimum 5MB)`,
          icon: "warning"
        });
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    // Yeni şəkillər üçün preview yarat
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index, isExistingImage = false, imageId = null) => {
    const previewToRemove = previews[index];
    
    // Preview URL-ni təmizlə
    if (previewToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove);
    }
    
    // Preview-dan sil
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    
    if (isExistingImage && imageId) {
      // Mövcud şəkili silinəcəklərə əlavə et
      setRemovedImages(prev => [...prev, imageId]);
    } else {
      // Yeni şəkili siyahıdan sil
      const newImages = images.filter((_, i) => {
        const fileUrl = URL.createObjectURL(images[i]);
        return fileUrl !== previewToRemove;
      });
      setImages(newImages);
    }

    // Əsas şəkil indeksini yenilə
    if (index === mainImageIndex) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  const setAsMainImage = (index) => {
    setMainImageIndex(index);
  };

  // Specs handlers
  const addSpecField = () => {
    setSpecsInput((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpecField = (idx) => {
    setSpecsInput((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleSpecChange = (e, idx) => {
    const { name, value } = e.target;
    setSpecsInput((prev) => {
      const updated = [...prev];
      updated[idx][name] = value;
      return updated;
    });
  };

  const validateForm = () => {
    const requiredFields = {
      name: "Ad", brand: "Brend", model: "Model", price: "Qiymət",
      description: "Açıqlama", category: "Kateqoriya", stock: "Stok", seller: "Satıcı"
    };

    for (const [field, fieldName] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return `${fieldName} sahəsi tələb olunur`;
      }
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      return "Qiymət düzgün formatda olmalıdır";
    }

    if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      return "Stok miqdarı düzgün formatda olmalıdır";
    }

    // Edit üçün şəkil tələb olunmur, çünki mövcud şəkillər ola bilər
    const remainingImages = previews.length - removedImages.length;
    if (remainingImages === 0 && images.length === 0) {
      return "Ən azı bir şəkil olmalıdır";
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
        icon: "error" 
      });
      return;
    }

    try {
      const updatedData = new FormData();
      
      // Basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          updatedData.append(key, value.toString());
        }
      });

      // Əsas şəkil indeksini əlavə et
      updatedData.append("mainImageIndex", mainImageIndex.toString());

      // Specs-i əlavə et
      const specsObj = {};
      specsInput.forEach((item) => {
        if (item.key && item.value && item.key.trim() !== '' && item.value.trim() !== '') {
          specsObj[item.key.trim()] = item.value.trim();
        }
      });
      
      if (Object.keys(specsObj).length > 0) {
        updatedData.append("specs", JSON.stringify(specsObj));
      }

      // Yeni şəkilləri əlavə et
      images.forEach((file) => {
        updatedData.append("images", file);
      });

      // Silinəcək şəkilləri əlavə et
      removedImages.forEach((imageId) => {
        updatedData.append("removedImages", imageId);
      });

      // Debug üçün
      console.log("Göndərilən məlumatlar:");
      console.log("Əsas şəkil indeksi:", mainImageIndex);
      console.log("Silinəcək şəkillər:", removedImages);
      for (let [key, value] of updatedData.entries()) {
        if (key === "images") {
          console.log(key, value.name);
        } else {
          console.log(key, value);
        }
      }

      const result = await editProduct({ 
        id, 
        formData: updatedData 
      }).unwrap();

      console.log("Uğurlu cavab:", result);
      
      // Preview URL-lərini təmizlə
      previews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      Swal.fire({
        title: "Uğurlu!",
        text: "Məhsul uğurla yeniləndi!",
        icon: "success",
      }).then(() => {
        navigate("/admin/adminproducts");
        refetch();
      });

    } catch (err) {
      console.error("Xəta detalları:", err);
      
      let errorMessage = "Məhsul yenilənmədi!";
      
      if (err?.data?.error) {
        errorMessage = err.data.error;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.status === 'FETCH_ERROR') {
        errorMessage = "Serverlə əlaqə problemi. Zəhmət olmasa bir daha yoxlayın.";
      } else if (err?.status === 500) {
        if (err?.data?.message?.includes('Unexpected field')) {
          errorMessage = "Server konfiqurasiya xətası: Şəkil field adı uyğun gəlmir.";
        } else {
          errorMessage = "Server xətası. Şəkil fayllarının ölçüsünü yoxlayın.";
        }
      }
      
      Swal.fire({
        title: "Xəta!",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg">Yüklənir...</div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 text-center p-4">
      Xəta baş verdi: {error.message}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Məhsulu Redaktə Et</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ümumi sahələr */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ad"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brend *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Brend"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Model"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qiymət *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Qiymət"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Satıcı *</label>
            <input
              type="text"
              name="seller"
              value={formData.seller}
              onChange={handleInputChange}
              placeholder="Satıcı"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Stok"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kateqoriya *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Kateqoriya seçin</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıqlama *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Açıqlama"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Specs */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Texniki Xüsusiyyətlər (İstəyə bağlı)</h3>
          
          {specsInput.map((spec, index) => (
            <div key={index} className="flex gap-3 mb-3 items-end">
              <div className="flex-1">
                <input
                  name="key"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(e, index)}
                  placeholder="Xüsusiyyət (məs: RAM)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex-1">
                <input
                  name="value"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(e, index)}
                  placeholder="Dəyər (məs: 16GB)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {specsInput.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpecField(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition-colors"
                >
                  Sil
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSpecField}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            + Yeni Xüsusiyyət
          </button>
        </div>

        {/* Şəkillər */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Məhsul Şəkilləri (Maksimum 6 şəkil)
          </label>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={previews.length - removedImages.length + images.length >= 6}
            className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Əsas Şəkil (Ön şəkil)</h4>
            {previews.length > 0 && (
              <div className="mb-4 p-4 border-2 border-green-500 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <img
                    src={previews[mainImageIndex]}
                    alt="Əsas şəkil"
                    className="w-32 h-32 object-cover border-2 border-green-500 rounded-lg shadow-md"
                  />
                  <div>
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                      Əsas Şəkil
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Bu şəkil məhsulun ön şəkili kimi göstəriləcək
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-3 flex-wrap">
            {previews.length > 0 ? (
              previews.map((preview, index) => {
                const existingImage = data?.product?.images?.find(img => img.url === preview);
                const isExistingImage = !!existingImage;
                const isRemoved = removedImages.includes(existingImage?.public_id);

                if (isRemoved) return null;

                return (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className={`w-24 h-24 object-cover border rounded-md shadow-sm ${
                        index === mainImageIndex ? 'border-2 border-green-500' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => removeImage(index, isExistingImage, existingImage?.public_id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                      {index !== mainImageIndex && (
                        <button
                          type="button"
                          onClick={() => setAsMainImage(index)}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          title="Əsas şəkil et"
                        >
                          ★
                        </button>
                      )}
                    </div>
                    {index === mainImageIndex && (
                      <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-1">
                        Əsas
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                <span>Şəkil yoxdur</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Maksimum 6 şəkil. Maksimum şəkil ölçüsü: 5MB.
            {previews.length > 0 && " ★ ilə əsas şəkili seçə bilərsiniz."}
          </p>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {isUpdating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Yenilənir...
            </>
          ) : (
            "Məhsulu Yenilə"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;