import React, { useState, useEffect, useMemo } from "react";
import { useGetProductsQuery, useFilterProductsQuery } from "../redux/api/productsApi";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Heart, GitCompare, ZoomIn, SlidersHorizontal } from 'lucide-react';

// ⭐ REUSABLE STAR RATING COMPONENT
const StarRating = ({ rating = 0 }) => {
  return (
    <div className="flex text-yellow-400 my-2">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "fill-yellow-400" : "fill-gray-300"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.033a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.42 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// 🎛️ BUTTON COMPONENT
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-black",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-black",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-black",
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// 📏 SLIDER COMPONENT
const Slider = ({ min, max, step = 1, value: controlledValue, defaultValue = min, onChange }) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-6">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2">
        <div
          className="absolute top-0 left-0 h-full bg-black rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className="absolute top-1/2 w-4 h-4 bg-black rounded-full shadow transform -translate-y-1/2"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
};

// 🛒 PRODUCT CARD
const ProductCard = ({ mehsul }) => {
  const productImageUrl =
    mehsul?.images && mehsul.images.length > 0
      ? mehsul.images[0]?.url
      : mehsul?.image || "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Məhsul səbətə əlavə edildi:", mehsul?.name);
    toast.success("Məhsul səbətə əlavə edildi!");
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Məhsul favorilərə əlavə edildi:", mehsul?.name);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Müqayisə et:", mehsul?.name);
  };

  const handleZoomClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Zoom:", mehsul?.name);
  };

  return (
    <div 
      className="bg-white rounded-xl transition-all duration-300 flex flex-col p-3 sm:p-4 cursor-pointer w-full border border-gray-100 hover:shadow-xl focus:outline-none relative product-card group"
    >
      {/* HOT badge */}
      {mehsul?.isHot && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full z-10">
          HOT
        </div>
      )}
      
      {/* 20% Endirim Etiketi */}
      <div className="absolute top-2 left-2 bg-[#fe9034] text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
        20% Endirim
      </div>
      
      {/* Action Icons */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-sm hover:bg-white hover:shadow-md transition-all"
          onClick={handleCompareClick}
          title="Compare"
        >
          <GitCompare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-[#5C4977] transition-colors" />
        </button>
        <button 
          className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-sm hover:bg-white hover:shadow-md transition-all"
          onClick={handleZoomClick}
          title="Zoom"
        >
          <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-[#5C4977] transition-colors" />
        </button>
        <button 
          className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-sm hover:bg-white hover:shadow-md transition-all"
          onClick={handleFavoriteClick}
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-[#5C4977] transition-colors" />
        </button>
      </div>
      
      {/* Product Image */}
      <Link to={`/product/${mehsul?._id}`} className="w-full flex justify-center items-center mb-3 sm:mb-4" style={{ height: '200px' }}>
        <img 
          src={productImageUrl}
          alt={mehsul?.name}
          className="object-contain w-full h-full max-w-[180px] max-h-[180px] sm:max-w-[234px] sm:max-h-[234px] transition-transform duration-300 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg";
          }}
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-grow text-left">
        <div className="mb-2 sm:mb-3 flex-grow">
          <Link to={`/product/${mehsul?._id}`}>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-2 hover:text-[#5C4977] transition-colors">
              {mehsul?.name}
            </h3>
          </Link>
          
          {mehsul?.category && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mt-1">
              {mehsul.category}
            </p>
          )}
          
          {mehsul?.brand && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mt-0.5">
              {mehsul.brand}
            </p>
          )}
          
          <div className="mt-1 sm:mt-2">
            <StarRating rating={mehsul?.ratings || 5} />
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center mb-1 sm:mb-2">
            {mehsul?.stock > 0 ? (
              <span className="text-green-600 text-xs sm:text-sm flex items-center gap-1">
                <span className="text-green-600">✔</span> In stock
              </span>
            ) : (
              <span className="text-red-600 text-xs sm:text-sm">Out of stock</span>
            )}
          </div>
          
          <div className="text-base sm:text-lg font-bold text-[#5C4977] mb-2 sm:mb-3">
            {mehsul?.price?.toFixed(2) || mehsul?.price || "0,00"} ₼
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[#5C4977] hover:bg-[#5C4977]/90 text-white py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer"
          >
            Add To Cart
          </button>
          
          <div className="mt-2 text-xs text-gray-500">
            SKU: {mehsul?._id?.substring(0, 7) || mehsul?.sku || "N/A"}
          </div>
          
          {mehsul?.color && (
            <div className="mt-1 text-xs text-gray-500">
              Color: {mehsul.color}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 🛍 MAIN PAGE – PRODUCTS2 WITH FILTERS
const Products2 = () => {
  // Filter state-leri
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1299);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Tüm ürünleri getir
  const { data: allProductsData, error: allProductsError, isError: allProductsIsError, isLoading: allProductsLoading } = useGetProductsQuery();

  // Filtreleme için API - her zaman çalışsın
  const { data: filteredData, error: filteredError, isError: filteredIsError, isLoading: filteredLoading } = useFilterProductsQuery({
    category: selectedCategory || undefined, // Kategori yoksa undefined gönder
    price: `${priceMin}-${priceMax}`,
  });

  // Error handling
  useEffect(() => {
    if (allProductsIsError) {
      toast.error(allProductsError?.data?.message || "Məhsullar yüklənərkən xəta baş verdi");
      console.log(allProductsError);
    }
    if (filteredIsError) {
      toast.error(filteredError?.data?.message || "Filter tətbiq edilərkən xəta baş verdi");
      console.log(filteredError);
    }
  }, [allProductsIsError, filteredIsError, allProductsError, filteredError]);

  // Dynamic categories from products
  const dynamicCategories = useMemo(() => {
    const products = allProductsData?.products || [];
    const categoryObj = products.reduce((acc, product) => {
      const category = product.category;
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {});
    
    return Object.entries(categoryObj).map(([category, count]) => ({ category, count }));
  }, [allProductsData]);

  // Filtered products - FİLTRELEME MANTIĞI DÜZELTİLDİ
  const filteredProducts = useMemo(() => {
    // Hangi veriyi kullanacağımızı belirle
    const productsToFilter = selectedCategory 
      ? filteredData?.products || []  // Kategori seçiliyse filtrelenmiş veriyi kullan
      : allProductsData?.products || []; // Kategori seçili değilse tüm ürünleri kullan

    console.log("Filtering products:", {
      selectedCategory,
      allProductsCount: allProductsData?.products?.length,
      filteredDataCount: filteredData?.products?.length,
      productsToFilterCount: productsToFilter.length
    });

    // Fiyat filtresini uygula
    const priceFiltered = productsToFilter.filter(product => {
      const price = product.price || 0;
      return price >= priceMin && price <= priceMax;
    });

    console.log("After price filter:", priceFiltered.length);

    return priceFiltered;
  }, [
    selectedCategory, 
    allProductsData, 
    filteredData, 
    priceMin, 
    priceMax
  ]);

  const isLoading = allProductsLoading || filteredLoading;

  // Fiyat değişikliklerini takip et
  useEffect(() => {
    console.log("Filter states:", {
      priceMin,
      priceMax,
      selectedCategory
    });
  }, [priceMin, priceMax, selectedCategory]);

  if (isLoading) {
    return (
      <div className="container mx-auto mt-20 px-4 py-8">
        <div className="text-center text-xl mt-10">Yüklənir...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-800">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link to="/catalog" className="text-gray-500 hover:text-gray-800">
              Catalog
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-800">All Products</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel */}
        <div className={`bg-white p-6 rounded-lg shadow-sm border ${
          isFilterOpen ? "block" : "hidden"
        } lg:block w-full lg:w-80`}>
          <h3 className="font-semibold text-xl mb-6 border-b pb-4">Filtrlər</h3>
          
          {/* Category Filter */}
          <div className="mb-6">
            <label className="block mb-3 font-medium text-gray-700">Kateqoriya</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Bütün Məhsullar</option>
              {dynamicCategories.map((item) => (
                <option key={item.category} value={item.category}>
                  {item.category} ({item.count})
                </option>
              ))}
            </select>
          </div>
          
          {/* Price Filter */}
          <div className="mb-4">
            <label className="block mb-3 font-medium text-gray-700">Qiymət Aralığı (₼)</label>
            <div className="flex gap-3 mb-4">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setPriceMin(value);
                  if (value > priceMax) {
                    setPriceMax(value);
                  }
                }}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                min="0"
                max="2000"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setPriceMax(value);
                  if (value < priceMin) {
                    setPriceMin(value);
                  }
                }}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                min="0"
                max="2000"
              />
            </div>
            <div className="px-2">
              <Slider 
                min={0} 
                max={2000} 
                value={priceMax} 
                onChange={(value) => {
                  setPriceMax(value);
                  if (value < priceMin) {
                    setPriceMin(value);
                  }
                }} 
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{priceMin} ₼</span>
              <span>{priceMax} ₼</span>
            </div>
          </div>

          {/* Reset Filters */}
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => {
              setPriceMin(0);
              setPriceMax(1299);
              setSelectedCategory("");
            }}
          >
            Filtrləri Sıfırla
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Məhsullar</h2>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {isFilterOpen ? "Filtrləri Gizlət" : "Filtrləri Göstər"}
            </Button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory ? selectedCategory : "Bütün Məhsullar"}
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} məhsul tapıldı
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="relative">
                <ProductCard mehsul={product} />
              </div>
            ))}
          </div>

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">Məhsul tapılmadı</div>
              <div className="text-gray-500 text-sm mb-6">
                {selectedCategory 
                  ? "Seçdiyiniz filterlərə uyğun məhsul yoxdur." 
                  : "Hal-hazırda məhsul yoxdur."
                }
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceMin(0);
                  setPriceMax(1299);
                  setSelectedCategory("");
                }}
              >
                Filtrləri Sıfırla
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products2;