import { Keyboard, PenTool, Mouse, Headphones } from "lucide-react";
import '../assets/css/Thumbnail.css';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from "../components/ui/Container"
import Product from './Product';

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


export default function Accessory() {
  return (
    <div className="w-full py-4 sm:py-6">
      <Container>
      <div className="w-full">
        {/* Üst Bölüm: Hero ve Swiper Yan Yana */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8 xl:items-stretch">
          {/* Microsoft Accessories - 3/4 genişlik */}
          <div className="xl:col-span-3 flex flex-col">
            {/* Microsoft Accessories Section */}
            <section className="bg-white rounded-2xl py-12 lg:pr-6 px-2 md:mb-2 flex-1 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center h-full">
                {/* Sol: Şəkil */}
                <div className="relative flex items-center justify-center mx-auto md:mx-0">
                  <img
                    src="/images/microsoft-accessories.jpg"
                    alt="Microsoft Accessories collection with keyboard, headphones, tablet, mouse and stylus pen"
                    className="w-full h-auto max-w-md rounded-xl"
                  />
                </div>

                {/* Sağ: Məzmun */}
                <div className="space-y-3 sm:space-y-4 md:space-y-5 text-center md:text-left pb-0">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                      Microsoft Accessories
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Personalize your Surface Pro with Microsoft branded accessories. In the presence of many colors for every taste.
                    </p>
                  </div>

                  {/* Kateqoriya düymələri */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-2.5 pt-2 sm:pt-3 pb-0">
                    <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium cursor-pointer">
                      <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Keyboards</span>
                    </button>
                    <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium cursor-pointer">
                      <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Surface Pen</span>
                    </button>
                    <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium cursor-pointer">
                      <Mouse className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Mice</span>
                    </button>
                    <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium cursor-pointer">
                      <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Headphones</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3 Kart Section - Microsoft Accessories div'inin içine taşındı */}
            <section className="pt-5 md:-mt-2 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Kart 1 */}
                <div className="bg-gradient-to-br h-[170px] raun rounded-2xl p-6 text-white relative h-56 flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Xiaomi MI 11</h3>
                    <p className="text-blue-100 text-sm">Discount up to 30%</p>
                  </div>
                  <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold w-fit px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer">
                    View Details
                  </button>
                </div>

                {/* Kart 2 */}
                <div className="bg-gradient-to-br h-[170px] aypod rounded-2xl p-6 text-white relative h-56 flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">HP Laser Jet</h3>
                    <p className="text-orange-100 text-sm">Personal printer</p>
                  </div>
                  <button className="bg-white text-red-500 hover:bg-gray-100 font-semibold w-fit px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer">
                    View Details
                  </button>
                </div>

                {/* Kart 3 */}
                <div className="bg-gradient-to-br h-[170px] jops rounded-2xl p-6 text-white relative h-56 flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">White Joy Cons</h3>
                    <p className="text-red-100 text-sm">Long-awaited novelty</p>
                  </div>
                  <button className="bg-white text-red-600 hover:bg-gray-100 font-semibold w-fit px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Swiper Kart - 1/4 genişlik */}
          <div className="xl:col-span-1 flex">
            <section className="bg-white rounded-2xl p-4 sm:p-6 w-full flex flex-col h-full">
              <div className="w-full flex flex-col flex-1 min-h-0">
                {/* Başlıq */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                  Home Appliance
                </h2>

                {/* Swiper Container with Navigation */}
                <div className="relative group flex-1">
                  {/* Navigation Buttons */}
                  <button 
                    className="product-prev absolute -left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  
                  <button 
                    className="product-next absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Swiper */}
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={12}
                    slidesPerView={1}
                    navigation={{
                      prevEl: '.product-prev',
                      nextEl: '.product-next',
                    }}
                    className="product-swiper"
                    style={{
                      padding: '8px 0',
                      height: '100%'
                    }}
                  >
                    {products.map((product, index) => (
                      <SwiperSlide key={`${product.sku}-${index}`}>
                        <div className="flex justify-center">
                          <Product product={{
                            name: product.name,
                            brand: product.brand,
                            model: product.model,
                            type: product.type,
                            price: product.price,
                            inStock: product.inStock,
                            sku: product.sku,
                            imageUrl: product.imageUrl,
                            imageAlt: product.imageAlt,
                            isHot: product.isHot,
                            rating: product.rating || 4.5
                          }} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      </Container>
    </div>
  );
}

