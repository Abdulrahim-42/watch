import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Container from "../components/ui/Container"
import Product from './Product';

import 'swiper/css';
import 'swiper/css/navigation';

// Əsas Products Komponenti
const Products = ({ title = "Products", products = [], showBanner = false, bannerData = null }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = React.useRef(null);

  // Mobil/tablet kontrolü
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Drag handlers for horizontal scroll
  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full py-4 sm:py-6">
      <Container>
      <div className={`w-full ${showBanner ? 'flex flex-col lg:flex-row gap-6' : ''}`}>
        {/* Sol Banner Alanı */}
        {showBanner && bannerData && (
          <div className="w-full lg:w-[28%] flex-shrink-0">
            <div className="promo-banner-wrapper relative overflow-hidden rounded-2xl h-full" style={{ minHeight: showBanner ? '400px' : '500px' }}>
              <div className="promo-banner banner-default banner-hover-zoom color-scheme-light with-btn relative h-full">
                
                {/* Əsas şəkil wrapper */}
                <div className="main-wrapp-img h-full">
                  <div className="banner-image h-full">
                    <img 
                      loading="lazy" 
                      decoding="async"
                      src={bannerData.imageUrl}
                      alt={bannerData.alt || "Banner"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x720/6B7280/ffffff?text=Banner";
                      }}
                    />
                  </div>
                </div>

                {/* Məzmun wrapper */}
                <div className="wrapper-content-banner absolute inset-0 flex items-start justify-center pt-8">
                  <div className="content-banner text-center w-full px-4">
                    
                    {/* Subtitle */}
                    {bannerData.subtitle && (
                      <div className="banner-subtitle subtitle-style-default text-gray-300 text-sm font-medium mb-2 tracking-wide">
                        {bannerData.subtitle}
                      </div>
                    )}
                    
                    {/* Title */}
                    {bannerData.title && (
                      <h4 className="banner-title text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                        {bannerData.title}
                      </h4>
                    )}
                    
                    {/* Button */}
                    {bannerData.buttonText && (
                      <div className="banner-btn-wrapper mt-4">
                        <div className="wd-button-wrapper text-center">
                          <a 
                            href={bannerData.buttonLink || "#"} 
                            className="btn btn-style-default bg-[#5C4977] hover:bg-[#5C4977]/90 text-white py-2.5 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 inline-block text-sm cursor-pointer"
                          >
                            <span className="wd-btn-text">
                              {bannerData.buttonText}
                            </span>
                          </a>
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Sağ Ürün Alanı */}
        <div className={showBanner ? "w-full lg:w-[70%]" : "w-full"}>
        {/* Başlıq ve More Products Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:mb-5 mb-4 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          <button 
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-3xl transition-all duration-200 cursor-pointer hover:shadow-md text-xs sm:text-sm"
            style={{
              backgroundColor: '#E1EBFF',
              borderColor: '#E1EBFF',
              color: '#1C61E7',
              border: '1px solid #E1EBFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D1DBFF';
              e.currentTarget.style.borderColor = '#D1DBFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E1EBFF';
              e.currentTarget.style.borderColor = '#E1EBFF';
            }}
          >
            <span className="text-xs sm:text-sm font-medium">More Products</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1C61E7' }} />
          </button>
        </div>

        {/* Mobil/Tablet: Horizontal Scroll, Desktop: Swiper */}
        {isMobile ? (
          /* Mobil ve Tablet - Horizontal Scroll */
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto -mx-4 px-4 products-scroll" 
            style={{ WebkitOverflowScrolling: 'touch', paddingBottom: '12px', cursor: 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div className="flex gap-3 sm:gap-4 md:gap-5" style={{ width: 'max-content' }}>
              {products.map((product, index) => (
                <div 
                  key={`${product.sku || product.id || index}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: '280px', minWidth: '280px', pointerEvents: isDragging ? 'none' : 'auto' }}
                >
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Desktop - Swiper */
          <div className="relative slider-container w-full overflow-hidden">
            {/* Navigation Buttons - Hidden until hover */}
            <button 
              className="best-offers-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg opacity-0 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperInstance) {
                  swiperInstance.slidePrev();
                }
              }}
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
            
            <button 
              className="best-offers-next absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-1.5 sm:p-2 md:p-3 shadow-lg opacity-0 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperInstance) {
                  swiperInstance.slideNext();
                }
              }}
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
            </button>

            {/* Swiper */}
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={showBanner ? 3 : 4}
              watchOverflow={true}
              resistance={false}
              resistanceRatio={0}
              onSwiper={setSwiperInstance}
              breakpoints={{
                // Large tablets: 4 slides (banner yoksa) veya 3 slides (banner varsa)
                1024: {
                  slidesPerView: showBanner ? 3 : 4,
                  spaceBetween: 24,
                },
                // Desktop: 4 slides (banner yoksa) veya 3 slides (banner varsa)
                1280: {
                  slidesPerView: showBanner ? 3 : 4,
                  spaceBetween: 32,
                },
                // Large desktop: 4 slides (banner yoksa) veya 3 slides (banner varsa)
                1536: {
                  slidesPerView: showBanner ? 3 : 4,
                  spaceBetween: 20,
                },
              }}
              className={`best-offers-swiper w-full ${showBanner ? 'with-banner' : ''}`}
            >
              {products.map((product, index) => (
                <SwiperSlide key={`${product.sku || product.id || index}-${index}`}>
                  <Product product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Custom Styles */}
        <style jsx="true">{`
          /* Horizontal scrollbar styling */
          .products-scroll {
            margin-top: 12px;
            padding-top: 12px;
          }
          
          .products-scroll::-webkit-scrollbar {
            height: 10px;
          }
          
          .products-scroll::-webkit-scrollbar-track {
            background: #ffffff;
            border-radius: 10px;
          }
          
          .products-scroll::-webkit-scrollbar-thumb {
            background: #5C4977;
            border-radius: 10px;
          }
          
          .products-scroll::-webkit-scrollbar-thumb:hover {
            background: #4a3a62;
          }
          
          .products-scroll {
            scrollbar-width: auto;
            scrollbar-color: #5C4977 #ffffff;
          }
          
          .slider-container:hover .best-offers-prev,
          .slider-container:hover .best-offers-next {
            opacity: 1 !important;
          }
          
          .best-offers-swiper {
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
            width: 100% !important;
          }
          
          .best-offers-swiper .swiper-wrapper {
            align-items: flex-start;
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
          
          .best-offers-swiper .swiper-slide {
            height: auto;
            display: flex;
            justify-content: flex-start;
            width: auto !important;
            flex-shrink: 0;
          }
          
          .best-offers-swiper .swiper-slide:first-child {
            margin-left: 0 !important;
            padding-left: 0 !important;
          }

          /* Product card specific styling */
          .best-offers-swiper .swiper-slide > div {
            width: 100%;
            max-width: 100%;
            flex-shrink: 0;
          }
          
          /* Desktop'ta slide genişliğini container'a göre ayarla */
          @media (min-width: 1024px) {
            .best-offers-swiper:not(.with-banner) .swiper-slide {
              width: calc((100% - 96px) / 4) !important;
            }
            .best-offers-swiper.with-banner .swiper-slide {
              width: calc((100% - 64px) / 3) !important;
            }
            .best-offers-swiper .swiper-slide > div {
              max-width: 100% !important;
              width: 100% !important;
            }
          }
          
          @media (min-width: 1280px) {
            .best-offers-swiper:not(.with-banner) .swiper-slide {
              width: calc((100% - 96px) / 4) !important;
            }
            .best-offers-swiper.with-banner .swiper-slide {
              width: calc((100% - 64px) / 3) !important;
            }
            .best-offers-swiper .swiper-slide > div {
              max-width: 100% !important;
              width: 100% !important;
            }
          }

          /* Hide navigation buttons on touch devices when not hovering */
          @media (hover: none) {
            .best-offers-prev,
            .best-offers-next {
              opacity: 0.7 !important;
            }
          }

          /* Ensure smooth transitions */
          .best-offers-prev,
          .best-offers-next {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Banner hover effect */
          .banner-hover-zoom .banner-image img {
            transition: transform 0.3s ease;
          }

          .banner-hover-zoom:hover .banner-image img {
            transform: scale(1.05);
          }
        `}</style>
        </div>
      </div>
      </Container>
    </div>
  );
};

export default Products;

