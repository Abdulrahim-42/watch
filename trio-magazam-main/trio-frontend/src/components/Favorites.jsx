import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation, useAddToCartMutation } from "../redux/api/productsApi";
import { productApi } from "../redux/api/productsApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// Lucide icon
import { Heart } from "lucide-react";
import Rating from "./Rating";

const FavoriteButton = () => {
  const dispatch = useDispatch();
  const {
    data: favoriteData,
    isLoading,
    refetch,
  } = useGetFavoritesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [addToCart] = useAddToCartMutation();
  const [localFavorites, setLocalFavorites] = useState([]);

  // Favorit siyahısı dəyişdikcə localFavorites yenilənir
  useEffect(() => {
    if (favoriteData?.favorites) {
      setLocalFavorites(favoriteData.favorites);
    } else {
      setLocalFavorites([]);
    }
  }, [favoriteData]);

  // Favoritdən silmə əməliyyatı
  const handleRemoveFromFavorites = async (productId) => {
    try {
      await removeFromFavorites(productId).unwrap();
      setLocalFavorites((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Məhsul favorilərdən silindi");

      // Cache-in yenilənməsi
      dispatch(productApi.util.invalidateTags(["Favorites"]));

      // Yenidən favoritləri fetch etmək
      await refetch();
    } catch (error) {
      toast.error("Məhsul silinərkən xəta baş verdi");
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success("Məhsul səbətə əlavə edildi");
    } catch (error) {
      toast.error("Məhsul əlavə edilərkən xəta baş verdi");
    }
  };

  // 1) Yüklənmə vəziyyəti
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-400 mb-4"></div>
        <p className="text-gray-600 font-semibold text-xl">Yüklənir...</p>
      </div>
    );
  }

  // 2) Boş siyahı
  if (!localFavorites.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4">
        <div className="text-center space-y-6 max-w-md">
          {/* Böyük Heart ikonu - light grey outline */}
          <Heart className="mx-auto w-32 h-32 text-gray-300 stroke-2 fill-none mb-4" />

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            This wishlist is empty.
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            You don't have any products in the wishlist yet. You will find a lot of interesting products on our "Shop" page.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#5C4977] text-white text-base font-semibold rounded-lg hover:bg-[#4a3d62] transition-all duration-300"
          >
            Return To Shop
          </Link>
        </div>
      </div>
    );
  }

  // 3) Favoritlər siyahısı dolu olduqda
  return (
    <section className="min-h-screen mt-20 bg-gray-100 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Başlıq */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight mb-10">
          YOUR PRODUCTS WISHLIST
        </h2>

        {/* Məhsul Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {localFavorites.map((product) => (
            <div
              key={product._id}
              className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Şəkil və Badge */}
              <div className="relative overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images?.[0]?.url || "/default-product.jpg"}
                    alt={product.name || "Məhsul Şəkli"}
                    className="w-full h-64 object-contain bg-white transition-transform duration-300 ease-in-out group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/default-product.jpg";
                    }}
                  />
                </Link>
                
                {/* X Remove link - top left */}
                <button
                  onClick={() => handleRemoveFromFavorites(product._id)}
                  className="absolute top-2 left-2 text-gray-600 hover:text-red-600 font-semibold text-sm transition-colors z-10"
                >
                  X Remove
                </button>

                {/* HOT Badge - top left of image */}
                {product.isHot && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    HOT
                  </div>
                )}
              </div>

              {/* Məhsul Məlumatı */}
              <div className="p-4 bg-white">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Category */}
                {product.category && (
                  <p className="text-sm text-gray-600 mb-1">{product.category}</p>
                )}
                
                {/* Brand */}
                {product.brand && (
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                )}
                
                {/* Rating */}
                <div className="mb-2">
                  <Rating rating={product.ratings || 5} />
                </div>
                
                {/* In Stock */}
                <div className="flex items-center mb-2">
                  {product.stock > 0 ? (
                    <span className="text-green-600 text-sm flex items-center">
                      <span className="mr-1">✓</span> In stock
                    </span>
                  ) : (
                    <span className="text-red-600 text-sm">Out of stock</span>
                  )}
                </div>
                
                {/* Price */}
                <p className="text-xl font-bold text-gray-800 mb-3">
                  {product.price.toFixed(2)} ₼
                </p>
                
                {/* Add To Cart Button */}
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="w-full bg-[#5C4977] hover:bg-[#4a3d62] text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 mb-2"
                >
                  Add To Cart
                </button>
                
                {/* SKU */}
                <p className="text-xs text-gray-500">
                  SKU: {product._id?.substring(0, 6) || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FavoriteButton;