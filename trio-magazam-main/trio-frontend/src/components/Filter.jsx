import React, { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useFilterProductsQuery } from "../redux/api/productsApi";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Heart, GitCompare, ZoomIn } from 'lucide-react';

/*---------------------- REUSABLE STAR RATING COMPONENT ----------------------*/
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

/*---------------------- PRODUCT CARD COMPONENT ----------------------*/
const ProductCard = ({ mehsul }) => {
  // Şəkil URL-ni təyin et - Products2 komponenti ilə eyni məntiq
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
      style={{ 
        minWidth: '100%',
        maxWidth: '100%'
      }}
    >
      {/* HOT badge - Red oval */}
      {mehsul?.isHot && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full z-10">
          HOT
        </div>
      )}
      
      {/* Action Icons - Top Right (Compare, Zoom, Wishlist) */}
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
      
      {/* Məhsul Şəkili sahəsi - sabit ölçü */}
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

      {/* Məhsul Məlumatı - sabit ölçü */}
      <div className="flex flex-col flex-grow text-left">
        <div className="mb-2 sm:mb-3 flex-grow">
          <Link to={`/product/${mehsul?._id}`}>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-2 hover:text-[#5C4977] transition-colors">
              {mehsul?.name}
            </h3>
          </Link>
          
          {/* Category */}
          {mehsul?.category && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mt-1">
              {mehsul.category}
            </p>
          )}
          
          {/* Brand */}
          {mehsul?.brand && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mt-0.5">
              {mehsul.brand}
            </p>
          )}
          
          {/* Rating */}
          <div className="mt-1 sm:mt-2">
            <StarRating rating={mehsul?.ratings || 5} />
          </div>
        </div>
        
        <div className="mt-auto">
          {/* Stock Status */}
          <div className="flex items-center mb-1 sm:mb-2">
            {mehsul?.stock > 0 ? (
              <span className="text-green-600 text-xs sm:text-sm flex items-center gap-1">
                <span className="text-green-600">✔</span> In stock
              </span>
            ) : (
              <span className="text-red-600 text-xs sm:text-sm">Out of stock</span>
            )}
          </div>
          
          {/* Price */}
          <div className="text-base sm:text-lg font-bold text-[#5C4977] mb-2 sm:mb-3">
            {mehsul?.price?.toFixed(2) || mehsul?.price || "0,00"} ₼
          </div>
          
          {/* Add to Cart button - Purple */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[#5C4977] hover:bg-[#5C4977]/90 text-white py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer"
          >
            Add To Cart
          </button>
          
          {/* SKU */}
          <div className="mt-2 text-xs text-gray-500">
            SKU: {mehsul?._id?.substring(0, 7) || mehsul?.sku || "N/A"}
          </div>
          
          {/* Color (if applicable) */}
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

/*---------------------- Button Component ----------------------*/
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
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

/*---------------------- Slider Component ----------------------*/
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

/*---------------------- Main Filter Component ----------------------*/
const Filter = () => {
  // Qiymət filter state‑ləri
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1299);
  // Seçilmiş ölçü üçün state
  const [selectedSize, setSelectedSize] = useState("");
  // Filter panelinin açılıb-bağlanması (mobil üçün)
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Backend‑də filter üçün "Men" kateqoriyası və qiymət aralığı göndərilir
  const { data, error, isError, isLoading } = useFilterProductsQuery({
    category: "Men",
    price: `${priceMin}-${priceMax}`,
  });

  useEffect(() => {
    if (isError) {
      console.error(error);
      toast.error(error?.data?.message || "Bir xəta baş verdi!");
    }
  }, [isError, error]);

  // Dinamik ölçü siyahısını backend‑dən gələn məhsullardan hesablamaq
  const sizeObj = data?.products?.reduce((acc, product) => {
    const size = product.size;
    if (size) {
      acc[size] = (acc[size] || 0) + 1;
    }
    return acc;
  }, {});
  const dynamicSizes = sizeObj
    ? Object.entries(sizeObj).map(([size, count]) => ({ size, count }))
    : [];

  // Seçilmiş ölçü varsa, əlavə frontend filter tətbiq olunur
  const filteredProducts = selectedSize
    ? data?.products?.filter((product) => product.size === selectedSize)
    : data?.products;

  // Loading state
  if (isLoading) {
    return (
      <div className="container mt-20 mx-auto px-4 py-8">
        <div className="text-center text-xl mt-10">Yüklənir...</div>
      </div>
    );
  }

  return (
    <div className="container mt-20 mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="#" className="text-gray-500 hover:text-gray-800">
              Home
            </a>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <a href="#" className="text-gray-500 hover:text-gray-800">
              Catalog
            </a>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-800">Men</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel (həm masaüstü, həm mobil üçün) */}
        <div
          className={`bg-white p-4 rounded-md shadow ${
            isFilterOpen ? "block" : "hidden"
          } lg:block w-full lg:w-64`}
        >
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Filtrlər</h3>
          
          {/* Ölçü Filter */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Ölçü</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Bütün Ölçülər</option>
              {dynamicSizes.map((item) => (
                <option key={item.size} value={item.size}>
                  {item.size} ({item.count})
                </option>
              ))}
            </select>
          </div>
          
          {/* Qiymət Filter */}
          <div>
            <label className="block mb-2 font-medium">Qiymət (₼)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <Slider min={0} max={2000} value={priceMax} onChange={setPriceMax} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobil Filter Toggle */}
          <div className="lg:hidden mb-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              {isFilterOpen ? "Filtrləri Gizlət" : "Filtrləri Göstər"}
            </Button>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold">Məhsullar</h2>
            <p className="text-gray-600">
              Seçilmiş məhsullar: {filteredProducts?.length || 0}
            </p>
          </div>

          {/* Məhsul Kartları - Products2 komponenti ilə eyni grid strukturu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts?.map((product) => (
              <div
                key={product._id}
                className="relative"
              >
                {/* 20% Endirim Etiketi */}
                <span className="absolute top-2 left-2 bg-[#fe9034] text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
                  20% Endirim
                </span>

                {/* Product Card - Products2 komponentindəki kimi eyni struktur */}
                <ProductCard mehsul={product} />
              </div>
            ))}
          </div>

          {/* No Products Message */}
          {(!filteredProducts || filteredProducts.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">Məhsul tapılmadı</div>
              <div className="text-gray-500 text-sm">
                Seçdiyiniz filterlərə uyğun məhsul yoxdur.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;