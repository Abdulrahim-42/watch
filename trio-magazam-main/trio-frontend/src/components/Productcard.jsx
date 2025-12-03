import React from "react";
import { Link } from "react-router-dom";

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

const ProductCard = ({ mehsul }) => {
  const isOutOfStock = mehsul?.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return; // ehtiyat üçün, disabled olsa da

    // Səbətə əlavə etmə funksiyası burada
    console.log("Məhsul səbətə əlavə edildi:", mehsul?.name);
  };

  return (
    <Link to={`/product/${mehsul?._id}`}>
      <div className="relative border rounded-lg p-4 shadow-md hover:shadow-xl transition bg-white cursor-pointer">
        {/* Stokda bitib badge-i */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Stokda bitib
          </span>
        )}

        <img
          src={mehsul?.image}
          alt={mehsul?.name}
          className="w-full h-40 object-cover rounded-md"
        />

        <h3 className="font-semibold mt-3 text-lg line-clamp-2">
          {mehsul?.name}
        </h3>

        <p className="text-gray-600">{mehsul?.price} AZN</p>

        {/* Stok məlumatı */}
        <p
          className={`mt-1 text-sm font-medium ${
            isOutOfStock ? "text-red-500" : "text-green-600"
          }`}
        >
          {isOutOfStock
            ? "Stokda bitib"
            : `Stokda: ${mehsul?.stock ?? 0} ədəd`}
        </p>

        <StarRating rating={mehsul?.rating || 4} />

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full mt-3 py-2 rounded-md text-white transition ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isOutOfStock ? "Stokda bitib" : "Səbətə əlavə et"}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
