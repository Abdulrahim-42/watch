import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { 
  useGetProductDetailsQuery, 
  useAddToCartMutation, 
  useAddToFavoritesMutation
} from '../redux/api/productsApi';
import { toast } from "react-hot-toast";
import { Heart, Share2, GitCompare, Eye, ChevronRight, ShoppingBag } from 'lucide-react';
import { FaFacebook, FaTwitter, FaPinterest, FaLinkedin } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import { FaApplePay, FaGooglePay } from 'react-icons/fa';
import Button from '../components/ui/Button';

// ⭐ REUSABLE STAR RATING COMPONENT
const StarRating = ({ rating = 0 }) => {
  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 sm:w-5 sm:h-5 ${i < rating ? "fill-yellow-400" : "fill-gray-300"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.033a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.42 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const params = useParams();
  const { data, isLoading, error, isError } = useGetProductDetailsQuery(params?.id);
  const product = data?.product;

  // RTK Query mutations
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToFavorites, { isLoading: isAddingToFavorites }] = useAddToFavoritesMutation();

  const [activeImg, setActiveImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // ✅ Stok yoxlaması
  const isOutOfStock = (product?.stock ?? 0) <= 0;

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setActiveImg(product.images[0].url);
    } else {
      setActiveImg("https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg");
    }
  }, [product]);

  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) {
      setQuantity(quantity - 1);
    }
    if (type === 'inc') {
      const maxQty = product?.stock ?? 1;
      if (quantity < maxQty) {
        setQuantity(quantity + 1);
      } else {
        toast.error("Stokda bu qədər məhsul yoxdur!");
      }
    }
  };

  // ✅ SƏBƏTƏ ƏLAVƏ ET
  const handleAddToCart = async () => {
    if (!product) return;

    if (isOutOfStock) {
      toast.error("Məhsul stokda qalmayıb!");
      return;
    }

    try {
      await addToCart({ 
        productId: product._id, 
        quantity: quantity 
      }).unwrap();
      toast.success("Məhsul səbətə əlavə edildi!");
    } catch (error) {
      toast.error("Məhsulu səbətə əlavə edərkən xəta baş verdi!");
    }
  };

  // ✅ FAVORİTLƏRƏ ƏLAVƏ ET (button)
  const handleAddToFavorites = async () => {
    if (!product) return;

    if (isOutOfStock) {
      toast.error("Məhsul stokda qalmayıb!");
      return;
    }

    try {
      await addToFavorites(product._id).unwrap();
      toast.success("Məhsul favorilərə əlavə edildi!");
    } catch (err) {
      toast.error(
        err?.data?.message || "Məhsulu favorilərə əlavə edərkən xəta baş verdi!"
      );
    }
  };

  // ❤️ Şəkil üstündəki HEART icon
  const handleFavoriteIconClick = async (e) => {
    e.stopPropagation();
    if (!product) return;

    if (isOutOfStock) {
      toast.error("Məhsul stokda qalmayıb!");
      return;
    }

    try {
      await addToFavorites(product._id).unwrap();
      toast.success("Məhsul favorilərə əlavə edildi!");
    } catch (err) {
      toast.error(
        err?.data?.message || "Məhsulu favorilərə əlavə edərkən xəta baş verdi!"
      );
    }
  };

  // ✅ İNDİ AL
  const handleBuyNow = async () => {
    if (!product) return;

    if (isOutOfStock) {
      toast.error("Məhsul stokda qalmayıb!");
      return;
    }

    setIsBuyingNow(true);
    try {
      await addToCart({ 
        productId: product._id, 
        quantity: quantity 
      }).unwrap();
      
      toast.success("Məhsul səbətə əlavə edildi! Sifariş səhifəsinə yönləndirilirsiniz...");
      // navigate('/checkout'); // istəsən əlavə edərsən
    } catch (error) {
      toast.error("Xəta baş verdi!");
    } finally {
      setIsBuyingNow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Məhsul tapılmadı.
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: product?.category || 'Computer & Office', path: '#' },
    { label: product?.brand || 'Input Devices', path: '#' },
    { label: product?.model || 'Card Readers', path: '#' },
    { label: product?.name || 'Product', path: null }
  ];

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-gray-100 min-h-screen" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="max-w-screen-xl px-3 sm:px-4 md:px-6 mx-auto 2xl:px-0">
        {/* Breadcrumbs */}
        <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
          <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-1 sm:gap-2">
                {index > 0 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-[#5C4977] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12">
            
            {/* LEFT COLUMN - IMAGE GALLERY */}
            <div className="shrink-0 max-w-full lg:max-w-none mx-auto flex flex-col-reverse lg:flex-row gap-3 sm:gap-4 md:gap-6">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-visible py-2 lg:py-0 lg:max-h-[500px] lg:overflow-y-auto">
                {product?.images?.map((img, index) => (
                  <div 
                    key={index} 
                    onClick={() => setActiveImg(img.url)}
                    className={`flex-shrink-0 cursor-pointer w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 rounded-lg p-1 transition-all duration-200 ${
                      activeImg === img.url 
                        ? 'border-[#5C4977] shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt="thumbnail" 
                      className="w-full h-full object-contain rounded-md" 
                    />
                  </div>
                )) || (
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 border-gray-200 rounded-lg p-1">
                    <img src={activeImg} alt="thumb" className="w-full h-full object-contain rounded-md" />
                  </div>
                )}
              </div>

              {/* Main Image */}
              <div className="flex-1 border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 flex items-center justify-center relative bg-white">
                {product?.isHot && (
                  <span className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    HOT
                  </span>
                )}
                
                <button 
                  className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-10 cursor-pointer bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-all"
                  onClick={handleFavoriteIconClick}
                  disabled={isAddingToFavorites}
                >
                  <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isAddingToFavorites ? 'text-gray-300' : 'text-gray-400 hover:text-red-500'} transition-all duration-300`} />
                </button>
                
                <img
                  className="w-full h-auto max-h-[280px] sm:max-h-[350px] md:max-h-[400px] lg:max-h-[500px] object-contain"
                  src={activeImg}
                  alt={product?.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg";
                  }}
                />
              </div>
            </div>

            {/* RIGHT COLUMN - DETAILS */}
            <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-0">
              {/* Title */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {product?.isHot && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    HOT
                  </span>
                )}
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product?.name || "Product Name"}
                </h1>
              </div>

              {/* Brand & Model */}
              <div className="mt-2 flex flex-col gap-1">
                {product?.brand && (
                  <p className="text-sm sm:text-base text-gray-400">
                    {product.brand}
                  </p>
                )}
                {product?.model && (
                  <p className="text-sm sm:text-base text-gray-400">
                    {product.model}
                  </p>
                )}
              </div>

              {/* Reviews & SKU */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={product?.ratings || 5} />
                  <span className="ml-1 text-xs sm:text-sm text-gray-500">
                    ({product?.numOfReviews || 1} customer review)
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  SKU: <span className="text-gray-900 font-medium">
                    {product?._id?.substring(0,6) || "397707"}
                  </span>
                </div>
              </div>

              {/* Promo Banner */}
              <div className="mt-4 sm:mt-6 bg-blue-600 text-white rounded-lg p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold">Apple Shopping Event</p>
                    <p className="text-xs text-blue-100">Hurry and get discounts on all Apple devices up to 20%</p>
                  </div>
                </div>
                <button className="bg-white text-blue-600 text-xs sm:text-sm font-bold px-3 py-1.5 rounded hover:bg-blue-50 transition-colors whitespace-nowrap">
                  Sale_coupon_15
                </button>
              </div>

              {/* Price & Stock */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5C4977]">
                  {product?.price?.toFixed(2) || "50,00"} <span className="text-lg sm:text-xl md:text-2xl">₼</span>
                </p>
                {isOutOfStock ? (
                  <span className="px-3 py-1 text-xs sm:text-sm font-medium text-red-700 bg-red-100 rounded-full w-fit">
                    Out of stock
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs sm:text-sm font-medium text-green-700 bg-green-100 rounded-full border border-green-200 flex items-center gap-1 w-fit">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div> In stock
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-4">
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {product?.description || "No description available."}
                </p>
              </div>

              {/* Quantity & Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-lg w-full sm:w-auto bg-white">
                  <button 
                    onClick={() => handleQuantityChange('dec')} 
                    className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-50 transition-colors rounded-l-lg"
                  >
                    -
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    className="w-10 sm:w-12 text-center border-none focus:ring-0 text-gray-900 font-medium bg-transparent" 
                  />
                  <button 
                    onClick={() => handleQuantityChange('inc')} 
                    className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-50 transition-colors rounded-r-lg"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || isOutOfStock}
                  className="flex-1"
                >
                  {isAddingToCart ? "Əlavə edilir..." : "Səbətə əlavə et"}
                </Button>

                {/* Favoritlər */}
                <Button
                  onClick={handleAddToFavorites}
                  disabled={isAddingToFavorites}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  {isAddingToFavorites ? "Əlavə edilir..." : "Favorilərə əlavə et"}
                </Button>

                {/* Buy Now */}
                <Button
                  onClick={handleBuyNow}
                  disabled={isBuyingNow || isOutOfStock}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isBuyingNow ? "İşlənir..." : "İndi Al"}
                </Button>
              </div>

              {/* Meta Actions */}
              <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-[#5C4977] transition-colors cursor-pointer">
                  <GitCompare className="w-4 h-4" />
                  Add to compare
                </button>
                <button 
                  className="flex items-center gap-1 hover:text-[#5C4977] transition-colors cursor-pointer"
                  onClick={handleAddToFavorites}
                >
                  <Heart className="w-4 h-4" />
                  Add to wishlist
                </button>
              </div>

              {/* Watching Notification */}
              <div className="mt-4 sm:mt-6 bg-gray-50 p-3 rounded-lg text-xs sm:text-sm text-gray-700 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <strong>19</strong> People watching this product now!
              </div>

              {/* Social Sharing */}
              <div className="mt-4 flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Share:</span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Facebook">
                    <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="X (Twitter)">
                    <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-red-600 transition-colors" aria-label="Pinterest">
                    <FaPinterest className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors" aria-label="LinkedIn">
                    <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#5C4977] transition-colors" aria-label="Email">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 sm:mt-6 border border-gray-200 rounded-lg divide-y divide-gray-200">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">🚚</span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">Pick up from the Woodmart Store</p>
                      <p className="text-xs text-gray-500">To pick up today</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-green-600">Free</span>
                </div>
                
                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">📦</span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">Courier delivery</p>
                      <p className="text-xs text-gray-500">Our courier will deliver to the specified address</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">2-3 Days</span>
                    <span className="text-xs sm:text-sm font-semibold text-green-600">Free</span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-100 rounded-full flex items-center justify-center text-[8px] font-bold text-red-600">
                      DHL
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">DHL Courier delivery</p>
                      <p className="text-xs text-gray-500">DHL courier will deliver to the specified address</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">2-3 Days</span>
                    <span className="text-xs sm:text-sm font-semibold text-green-600">Free</span>
                  </div>
                </div>
              </div>

              {/* Warranty & Returns */}
              <div className="mt-4 sm:mt-6 border border-gray-200 rounded-lg p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <span className="font-medium text-gray-900">Warranty 1 year</span>
                  </div>
                  <a href="#" className="text-[#5C4977] text-xs hover:underline font-medium">More details</a>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">↻</span>
                    </div>
                    <span className="font-medium text-gray-900">Free 30-Day returns</span>
                  </div>
                  <a href="#" className="text-[#5C4977] text-xs hover:underline font-medium">More details</a>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">We accept:</p>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="w-10 h-6 sm:w-12 sm:h-7 bg-blue-600 rounded flex items-center justify-center p-1">
                    <SiVisa className="w-full h-full text-white" />
                  </div>
                  <div className="w-10 h-6 sm:w-12 sm:h-7 bg-red-600 rounded flex items-center justify-center p-1">
                    <SiMastercard className="w-full h-full text-white" />
                  </div>
                  <div className="w-10 h-6 sm:w-12 sm:h-7 bg-indigo-600 rounded flex items-center justify-center p-1">
                    <span className="text-white text-xs font-bold">STRIPE</span>
                  </div>
                  <div className="w-10 h-6 sm:w-12 sm:h-7 bg-black rounded flex items-center justify-center p-1">
                    <FaApplePay className="w-full h-full text-white" />
                  </div>
                  <div className="w-10 h-6 sm:w-12 sm:h-7 bg-gray-100 rounded flex items-center justify-center p-1 border border-gray-300">
                    <FaGooglePay className="w-full h-full text-gray-800" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
