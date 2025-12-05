import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductDetailsQuery, 
  useEditProductMutation, 
  useGetProductsQuery 
} from '../../redux/api/productsApi';
import { useGetCategoriesQuery } from '../../redux/api/categoryApi';
import Swal from 'sweetalert2';
import { 
  Upload, 
  X, 
  Star, 
  Package, 
  Tag, 
  DollarSign, 
  FileText, 
  Layers, 
  ShoppingBag,
  Cpu,
  Image as ImageIcon,
  Save
} from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetProductDetailsQuery(id);
  const { refetch } = useGetProductsQuery();
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    price: '',
    description: '',
    category: '',
    subcategory: '',
    seller: '',
    stock: '',
  });
  
  // Seçilmiş kateqoriyanın alt kateqoriyalarını tap
  const selectedCategory = categories.find((cat) => cat.name === formData.category);
  const subcategories = selectedCategory?.subcategories || [];

  const [formErrors, setFormErrors] = useState({});
  const [specsInput, setSpecsInput] = useState([{ key: "", value: "" }]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

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
        subcategory: product.subcategory || '',
        seller: product.seller || '',
        stock: product.stock || '',
      });

      if (product.specs && typeof product.specs === 'object') {
        const specsArray = Object.entries(product.specs).map(([key, value]) => ({
          key,
          value: String(value)
        }));
        setSpecsInput(specsArray.length > 0 ? specsArray : [{ key: "", value: "" }]);
      }

      if (product.images && product.images.length > 0) {
        setPreviews(product.images.map(img => img.url));
        setMainImageIndex(0);
      }
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Əgər kateqoriya dəyişirsə, alt kateqoriyanı sıfırla
      if (name === "category") {
        return { ...prev, [name]: value, subcategory: "" };
      }
      return { ...prev, [name]: value };
    });
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'name':
        if (!value.trim()) errors.name = 'Ad tələb olunur';
        break;
      case 'brand':
        if (!value.trim()) errors.brand = 'Brend tələb olunur';
        break;
      case 'model':
        if (!value.trim()) errors.model = 'Model tələb olunur';
        break;
      case 'price':
        if (!value) errors.price = 'Qiymət tələb olunur';
        else if (isNaN(value) || Number(value) <= 0) errors.price = 'Qiymət düzgün formatda olmalıdır';
        break;
      case 'stock':
        if (!value) errors.stock = 'Stok tələb olunur';
        else if (isNaN(value) || Number(value) < 0) errors.stock = 'Stok miqdarı düzgün formatda olmalıdır';
        break;
      case 'description':
        if (!value.trim()) errors.description = 'Açıqlama tələb olunur';
        break;
      case 'category':
        if (!value.trim()) errors.category = 'Kateqoriya tələb olunur';
        break;
      case 'seller':
        if (!value.trim()) errors.seller = 'Satıcı tələb olunur';
        break;
    }
    
    setFormErrors(prev => ({ ...prev, ...errors }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    const totalImages = previews.length - removedImages.length + files.length;
    if (totalImages > 6) {
      Swal.fire({
        title: "Xəta!",
        text: "Maksimum 6 şəkil ola bilər",
        icon: "warning",
        background: '#f8f7fa',
        color: '#5C4977'
      });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Xəta!",
          text: `${file.name} faylının ölçüsü çox böyükdür (maksimum 5MB)`,
          icon: "warning",
          background: '#f8f7fa',
          color: '#5C4977'
        });
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index, isExistingImage = false, imageId = null) => {
    const previewToRemove = previews[index];
    
    if (previewToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove);
    }
    
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    
    if (isExistingImage && imageId) {
      setRemovedImages(prev => [...prev, imageId]);
    } else {
      const newImages = images.filter((_, i) => {
        const fileUrl = URL.createObjectURL(images[i]);
        return fileUrl !== previewToRemove;
      });
      setImages(newImages);
    }

    if (index === mainImageIndex) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  const setAsMainImage = (index) => {
    setMainImageIndex(index);
  };

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
    const errors = {};
    const requiredFields = {
      name: "Ad", brand: "Brend", model: "Model", price: "Qiymət",
      description: "Açıqlama", category: "Kateqoriya", stock: "Stok", seller: "Satıcı"
    };

    for (const [field, fieldName] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        errors[field] = `${fieldName} tələb olunur`;
      }
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = "Qiymət düzgün formatda olmalıdır";
    }

    if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      errors.stock = "Stok miqdarı düzgün formatda olmalıdır";
    }

    const remainingImages = previews.length - removedImages.length;
    if (remainingImages === 0 && images.length === 0) {
      Swal.fire({ 
        title: "Xəta", 
        text: "Ən azı bir şəkil olmalıdır", 
        icon: "error",
        background: '#f8f7fa',
        color: '#5C4977'
      });
      return false;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updatedData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          updatedData.append(key, value.toString());
        }
      });

      updatedData.append("mainImageIndex", mainImageIndex.toString());

      const specsObj = {};
      specsInput.forEach((item) => {
        if (item.key && item.value && item.key.trim() !== '' && item.value.trim() !== '') {
          specsObj[item.key.trim()] = item.value.trim();
        }
      });
      
      if (Object.keys(specsObj).length > 0) {
        updatedData.append("specs", JSON.stringify(specsObj));
      }

      images.forEach((file) => {
        updatedData.append("images", file);
      });

      removedImages.forEach((imageId) => {
        updatedData.append("removedImages", imageId);
      });

      const result = await editProduct({ 
        id, 
        formData: updatedData 
      }).unwrap();

      previews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      Swal.fire({
        title: "Uğurlu!",
        text: "Məhsul uğurla yeniləndi!",
        icon: "success",
        background: '#f8f7fa',
        color: '#5C4977'
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
        background: '#f8f7fa',
        color: '#5C4977'
      });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977] mb-4"></div>
        <div className="text-lg text-[#5C4977]">Məhsul məlumatları yüklənir...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full">
        <div className="text-red-500 text-center">
          <X className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Xəta baş verdi</h3>
          <p>{error.message}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 w-full bg-[#5C4977] text-white py-2 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 transition-colors"
          >
            Geri qayıt
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#5C4977] hover:text-[#5C4977]/70 transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Geri qayıt
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8 text-[#5C4977]" />
            <h1 className="text-3xl font-bold text-[#5C4977]">Məhsulu Redaktə Et</h1>
          </div>
          <p className="text-gray-600">"{formData.name}" məhsulunun məlumatlarını yeniləyin</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-[#5C4977]" />
                <h2 className="text-xl font-semibold text-[#5C4977]">Əsas Məlumatlar</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#5C4977] mb-2">
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      Ad *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('name', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    placeholder="Məhsulun adı"
                    disabled={isUpdating}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Brand */}
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-[#5C4977] mb-2">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Brend *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('brand', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.brand 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    placeholder="Brend"
                    disabled={isUpdating}
                  />
                  {formErrors.brand && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.brand}</p>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-[#5C4977] mb-2">
                    <span className="flex items-center gap-1">
                      <Cpu className="h-4 w-4" />
                      Model *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('model', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.model 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    placeholder="Model"
                    disabled={isUpdating}
                  />
                  {formErrors.model && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.model}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-[#5C4977] mb-2">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Qiymət *
                    </span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('price', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.price 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={isUpdating}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                {/* Seller */}
                <div>
                  <label htmlFor="seller" className="block text-sm font-medium text-[#5C4977] mb-2">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4" />
                      Satıcı *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="seller"
                    name="seller"
                    value={formData.seller}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('seller', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.seller 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    placeholder="Satıcı"
                    disabled={isUpdating}
                  />
                  {formErrors.seller && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.seller}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-[#5C4977] mb-2">
                    <span className="flex items-center gap-1">
                      <Layers className="h-4 w-4" />
                      Stok *
                    </span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('stock', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.stock 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    placeholder="0"
                    min="0"
                    disabled={isUpdating}
                  />
                  {formErrors.stock && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.stock}</p>
                  )}
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <label htmlFor="category" className="block text-sm font-medium text-[#5C4977] mb-2">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Kateqoriya *
                    </span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('category', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.category 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    disabled={isUpdating}
                  >
                    <option value="">Kateqoriya seçin</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                  )}
                </div>

                {/* Subcategory */}
                {formData.category && subcategories.length > 0 && (
                  <div className="md:col-span-2">
                    <label htmlFor="subcategory" className="block text-sm font-medium text-[#5C4977] mb-2">
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        Alt Kateqoriya
                      </span>
                    </label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors hover:border-[#5C4977]/40"
                      disabled={isUpdating}
                    >
                      <option value="">Alt kateqoriya seçin (istəyə bağlı)</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#5C4977] mb-2">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Açıqlama *
                  </span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('description', e.target.value)}
                  rows="4"
                  className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                    formErrors.description 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                  }`}
                  placeholder="Məhsul haqqında ətraflı məlumat..."
                  disabled={isUpdating}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>
            </div>

            {/* Specs Section */}
            <div className="border-t border-[#5C4977]/10 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-5 w-5 text-[#5C4977]" />
                <h2 className="text-xl font-semibold text-[#5C4977]">Texniki Xüsusiyyətlər</h2>
                <span className="text-sm text-gray-500">(İstəyə bağlı)</span>
              </div>

              <div className="space-y-4">
                {specsInput.map((spec, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        name="key"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(e, index)}
                        placeholder="Xüsusiyyət (məs: RAM)"
                        className="w-full px-4 py-2 border border-[#5C4977]/20 rounded-lg focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <input
                        name="value"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(e, index)}
                        placeholder="Dəyər (məs: 16GB)"
                        className="w-full px-4 py-2 border border-[#5C4977]/20 rounded-lg focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                      />
                    </div>
                    
                    {specsInput.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecField(index)}
                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                        title="Sil"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addSpecField}
                  className="flex items-center gap-2 text-[#5C4977] hover:text-[#5C4977]/70 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Yeni Xüsusiyyət Əlavə Et
                </button>
              </div>
            </div>

            {/* Images Section */}
            <div className="border-t border-[#5C4977]/10 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-[#5C4977]" />
                <h2 className="text-xl font-semibold text-[#5C4977]">Məhsul Şəkilləri</h2>
              </div>

              <div className="space-y-6">
                {/* Main Image Preview */}
                {previews.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">Əsas Şəkil</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <img
                        src={previews[mainImageIndex]}
                        alt="Əsas şəkil"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-green-500 shadow-lg"
                      />
                      <div>
                        <p className="text-sm text-gray-600">
                          Bu şəkil məhsulun ön şəkili kimi göstəriləcək
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Digər şəkillərin üzərindəki ★ düyməsinə klikləyərək əssas şəkili dəyişə bilərsiniz
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Yeni şəkillər əlavə edin (Maksimum 6)
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    previews.length - removedImages.length + images.length >= 6
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-[#5C4977]/30 hover:border-[#5C4977]/50 bg-[#5C4977]/5'
                  }`}>
                    <Upload className="h-12 w-12 text-[#5C4977]/50 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Şəkilləri buraya sürüşdürün və ya klikləyin</p>
                    <p className="text-sm text-gray-500 mb-4">Maksimum 6 şəkil, hər biri 5MB-dan az olmalıdır</p>
                    <label className="inline-block cursor-pointer">
                      <span className="bg-[#5C4977] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#5C4977]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Şəkil Seç
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={previews.length - removedImages.length + images.length >= 6 || isUpdating}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Image Gallery */}
                {previews.length > 0 && (
                  <div>
                    <h3 className="font-medium text-[#5C4977] mb-3">Şəkillər ({previews.length}/6)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {previews.map((preview, index) => {
                        const existingImage = data?.product?.images?.find(img => img.url === preview);
                        const isExistingImage = !!existingImage;
                        const isRemoved = removedImages.includes(existingImage?.public_id);

                        if (isRemoved) return null;

                        return (
                          <div key={index} className="relative group">
                            <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
                              index === mainImageIndex ? 'border-green-500' : 'border-gray-200'
                            }`}>
                              <img
                                src={preview}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => removeImage(index, isExistingImage, existingImage?.public_id)}
                                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
                                title="Sil"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              {index !== mainImageIndex && (
                                <button
                                  type="button"
                                  onClick={() => setAsMainImage(index)}
                                  className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
                                  title="Əsas şəkil et"
                                >
                                  <Star className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            
                            {index === mainImageIndex && (
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Əsas
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-[#5C4977]/10 pt-6">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-gradient-to-r from-[#5C4977] to-[#7A659E] text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isUpdating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Məhsul yenilənir...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Save className="h-5 w-5" />
                    Məhsulu Yenilə
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;