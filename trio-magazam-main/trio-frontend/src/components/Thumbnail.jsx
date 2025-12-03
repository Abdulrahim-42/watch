import { Keyboard, PenTool, Mouse, Headphones } from "lucide-react";
import '../assets/css/Thumbnail.css';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from "../components/ui/Container"

import 'swiper/css';
import 'swiper/css/navigation';

// Məhsul məlumatları
const products = [
  {
    name: "Acer SA100 SATAIII",
    brand: "SSD Drive",
    model: "Philips",
    type: "SATA 2.5\" Solid State Drive",
    price: "30,00 ₼",
    inStock: true,
    sku: "5334126",
    imageUrl: "/images/thebestoffers/acer-sa100-sataiii-1.jpg",
    imageAlt: "Acer SA100 SATA SSD Drive",
    isHot: true
  },
  {
    name: "Alogic Ultra Mini USB",
    brand: "Card Readers",
    model: "ASUS",
    type: "SATA 2.5\" Solid State Drive",
    price: "50,00 ₼",
    inStock: true,
    sku: "5334127",
    imageUrl: "/images/thebestoffers/alogic1.jpg",
    imageAlt: "Alogic Ultra Mini USB",
    isHot: true
  },
  {
    name: "AMD Ryzen 5 7600X",
    brand: "Processors",
    model: "HP",
    type: "SATA 2.5\" Solid State Drive",
    price: "299,00 ₼",
    inStock: true,
    sku: "5334128",
    imageUrl: "/images/thebestoffers/amd-ryzen-5-7600x-1.jpg",
    imageAlt: "AMD Ryzen 5 7600X",
    isHot: true
  },
  {
    name: "Apple iPad Mini 6 Wi-Fi",
    brand: "Apple Ipad",
    model: "Apple",
    type: "SATA 2.5\" Solid State Drive",
    price: "500,00 ₼ – 600,00 ₼",
    inStock: true,
    sku: "5334129",
    imageUrl: "/images/thebestoffers/apple-ipad-mini-pink-1.jpg",
    imageAlt: "Apple iPad Mini 6 Wi-Fi",
    isHot: true
  },
  {
    name: "Apple MacBook Pro 16″ M1",
    brand: "Apple MacBook",
    model: "Apple",
    type: "SATA 2.5\" Solid State Drive",
    price: "2.999,00 ₼",
    inStock: true,
    sku: "5334130",
    imageUrl: "/images/thebestoffers/apple-macbook-pro-16.jpg",
    imageAlt: "Apple MacBook Pro 16″ M1",
    isHot: true
  }
];

// Məhsul kartı komponenti
const Product = ({ product }) => (
  <div 
    className="bg-white rounded-xl hover:shadow-xl transition-all duration-300 flex flex-col p-4 cursor-pointer w-full border-gray-100 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none relative product-card"
    style={{ 
      minHeight: '530px',
      maxHeight: '420px',
      minWidth: '300px',
      maxWidth: '240px'
    }}
  >
    {/* HOT badge */}
    {product.isHot && (
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
        HOT
      </div>
    )}
    
    {/* Məhsul Şəkili sahəsi - sabit ölçü */}
    <div className="w-full flex justify-center items-center mb-4" style={{ height: '160px' }}>
      <img 
        src={product.imageUrl} 
        alt={product.imageAlt} 
        className="object-contain w-full h-full max-w-[140px] max-h-[140px]"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/140x140/6B7280/ffffff?text=Product+Image"; }}
      />
    </div>

    {/* Məhsul Məlumatı - sabit ölçü */}
    <div className="flex flex-col flex-grow text-left" style={{ height: '200px' }}>
      <div className="mb-3 flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-1">{product.brand}</p>
        <p className="text-xs text-gray-500 line-clamp-1">{product.model}</p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.type}</p>
      </div>
      
      <div className="mt-auto">
        {/* Stok statusu */}
        <div className="flex items-center mb-2">
          {product.inStock ? (
            <span className="text-green-600 text-sm flex items-center">
              <span className="mr-1">✔</span> In stock
            </span>
          ) : (
            <span className="text-red-600 text-sm">Out of stock</span>
          )}
        </div>
        
        {/* Qiymət */}
        <div className="text-lg font-bold text-[#5C4977] mb-3">
          {product.price}
        </div>
        
        {/* Add to Cart button */}
        <button className="w-full bg-[#5C4977] hover:bg-[#5C4977]/90 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 mb-2">
          Add To Cart
        </button>
        
        {/* SKU */}
        <p className="text-xs text-gray-400 text-center">
          SKU: {product.sku}
        </p>
      </div>
    </div>
  </div>
);

// HomeAppliance komponenti - Compact versiya
const HomeAppliance = () => {
  return (
    <div className="w-full h-full">
      {/* Başlıq */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
        Home Appliance
      </h2>

      {/* Swiper Container with Navigation */}
      <div className="relative group h-full">
        {/* Navigation Buttons - Kartın düz sağ ve solunda */}
        <button className="home-appliance-prev absolute -left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl">
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>
        
        <button className="home-appliance-next absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl">
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView={1}
          navigation={{
            prevEl: '.home-appliance-prev',
            nextEl: '.home-appliance-next',
          }}
          className="home-appliance-swiper h-full"
          style={{
            padding: '8px 0'
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={`${product.sku}-${index}`}>
              <div className="flex justify-center">
                <Product product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default function ProductShowcase() {
  return (
    <div className="w-full py-4 sm:py-6">
      <Container>
      <div className="w-full">
        {/* Üst Bölüm: Hero ve Swiper Yan Yana */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
          {/* Microsoft Accessories - 3/4 genişlik */}
          <div className="xl:col-span-3">
            {/* Microsoft Accessories Section */}
            <section className="py-12 md:py-16 bg-white rounded-2xl h-[480px] mb-6"> {/* mb-6 eklendi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Sol: Şəkil */}
                <div className="relative flex items-center justify-center">
                  <img
                    src="/images/microsoft-accessories.jpg"
                    alt="Microsoft Accessories collection with keyboard, headphones, tablet, mouse and stylus pen"
                    className="w-full h-auto max-w-md rounded-xl"
                  />
                </div>

                {/* Sağ: Məzmun */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                      Microsoft Accessories
                    </h1>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Personalize your Surface Pro with Microsoft branded accessories. In the presence of many colors for every taste.
                    </p>
                  </div>

                  {/* Kateqoriya düymələri */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium">
                      <Keyboard size={16} /> Keyboards
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium">
                      <PenTool size={16} /> Surface Pen
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium">
                      <Mouse size={16} /> Mice
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium">
                      <Headphones size={16} /> Headphones
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3 Kart Section - Microsoft Accessories div'inin içine taşındı */}
            <section className="py-6"> {/* py-8'den py-6'ya düşürüldü */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Kart 1 */}
                <div className="bg-gradient-to-br h-[170px] raun rounded-2xl p-6 text-white relative h-56 flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Xiaomi MI 11</h3>
                    <p className="text-blue-100 text-sm">Discount up to 30%</p>
                  </div>
                  <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold w-fit px-4 py-2 rounded-lg transition-colors text-sm">
                    View Details
                  </button>
                </div>

                {/* Kart 2 */}
                <div className="bg-gradient-to-br h-[170px] aypod rounded-2xl p-6 text-white relative h-56 flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">HP Laser Jet</h3>
                    <p className="text-orange-100 text-sm">Personal printer</p>
                  </div>
                  <button className="bg-white text-red-500 hover:bg-gray-100 font-semibold w-fit px-4 py-2 rounded-lg transition-colors text-sm">
                    View Details
                  </button>
                </div>

                {/* Kart 3 */}
                <div className="bg-gradient-to-br h-[170px] jops rounded-2xl p-6 text-white relative h-56 flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">White Joy Cons</h3>
                    <p className="text-red-100 text-sm">Long-awaited novelty</p>
                  </div>
                  <button className="bg-white text-red-600 hover:bg-gray-100 font-semibold w-fit px-4 py-2 rounded-lg transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Swiper Kart - 1/4 genişlik */}
          <div className="xl:col-span-1">
            <section className="bg-white rounded-2xl p-6 h-full">
              <HomeAppliance />
            </section>
          </div>
        </div>
      </div>
      </Container>
    </div>
  );
}