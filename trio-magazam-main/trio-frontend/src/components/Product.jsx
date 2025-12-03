import React from 'react';
import { Heart } from 'lucide-react';
import Rating from './Rating';

// Product Card Component
const Product = ({ product }) => (
  <div 
    className="bg-white rounded-xl transition-all duration-300 flex flex-col p-3 sm:p-4 cursor-pointer w-full border border-gray-100 focus:outline-none relative product-card group"
    style={{ 
      minWidth: '100%',
      maxWidth: '100%'
    }}
  >
    {/* HOT badge */}
    {product.isHot && (
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
        HOT
      </div>
    )}
    
    {/* Heart icon */}
    <button className="absolute top-2 right-2 z-10 cursor-pointer">
      <Heart className="w-6 h-6 text-gray-400 hover:text-[#5C4977] transition-all duration-300 cursor-pointer" />
    </button>
    
    {/* Məhsul Şəkili sahəsi - sabit ölçü */}
    <div className="w-full flex justify-center items-center mb-3 sm:mb-4" style={{ height: '200px' }}>
      <img 
        src={product.imageUrl} 
        alt={product.imageAlt} 
        className="object-contain w-full h-full max-w-[180px] max-h-[180px] sm:max-w-[234px] sm:max-h-[234px] transition-transform duration-300 ease-out group-hover:scale-110"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/234x234/6B7280/ffffff?text=Product+Image"; }}
      />
    </div>

    {/* Məhsul Məlumatı - sabit ölçü */}
    <div className="flex flex-col flex-grow text-left">
      <div className="mb-2 sm:mb-3 flex-grow">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-2">{product.name}</h3>
        <p className="text-sm sm:text-base text-gray-400 line-clamp-1 mt-1 sm:mt-2">{product.brand}</p>
        <p className="text-sm sm:text-base text-gray-400 line-clamp-1 mt-0.5 sm:mt-1">{product.model}</p>
        <div className="mt-1 sm:mt-2">
          <Rating rating={product.rating || 5} />
        </div>
      </div>
      
      <div className="mt-auto">
        {/* Stok statusu */}
        <div className="flex items-center mb-1 sm:mb-2">
          {product.inStock ? (
            <span className="text-green-600 text-xs sm:text-sm flex items-center">
              <span className="mr-1">✔</span> In stock
            </span>
          ) : (
            <span className="text-red-600 text-xs sm:text-sm">Out of stock</span>
          )}
        </div>
        
        {/* Qiymət */}
        <div className="text-base sm:text-lg font-bold text-[#5C4977] mb-2 sm:mb-3">
          {product.price}
        </div>
        
        {/* Add to Cart button */}
        <button className="w-full bg-[#5C4977] hover:bg-[#5C4977]/90 text-white py-3 sm:py-3.5 md:py-4 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200 mb-2 cursor-pointer">
          Add To Cart
        </button>
      </div>
    </div>
  </div>
);

export default Product;
