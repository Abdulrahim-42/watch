import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from "../components/ui/Container"

import 'swiper/css';
import 'swiper/css/navigation';

const Blog = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const scrollContainerRef = useRef(null);

  // Mobil/tablet kontrolü (768px altında)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
  const articles = [
    {
      id: 1,
      image: "/images/best-gaming-laptop-model-entry-header-opt.jpg",
      category: "Gaming, Laptops",
      date: "13 Dec 2022",
      title: "Best Gaming Laptop Models",
      description: "At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles...",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      category: "Hi-Fi, Sound",
      date: "13 Dec 2022",
      title: "How to choose a HI-FI stereo system",
      description: "Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi...",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=250&fit=crop",
      category: "Keyboards",
      date: "13 Dec 2022",
      title: "Logitech POP Keys",
      description: "Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci...",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=250&fit=crop",
      category: "Cameras",
      date: "13 Dec 2022",
      title: "Cameras for Street Photography",
      description: "At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles. Ma quande lingues coale...",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=250&fit=crop",
      category: "Keyboards",
      date: "13 Dec 2022",
      title: "Logitech POP Keys",
      description: "Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci...",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=250&fit=crop",
      category: "Cameras",
      date: "13 Dec 2022",
      title: "Cameras for Street Photography",
      description: "At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles. Ma quande lingues coale...",
    },
  ];

  return (
    <section className="bg-gray-100">
      <Container>
      <div className="w-full py-4 sm:py-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 tracking-tight text-center sm:text-left">Our Articles</h2>
        
        {/* Mobil/Tablet: Horizontal Scroll, Desktop: Grid */}
        {isMobile ? (
          /* Mobil ve Tablet - Horizontal Scroll */
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto -mx-4 px-4 articles-scroll" 
            style={{ WebkitOverflowScrolling: 'touch', paddingBottom: '12px', cursor: 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {articles.map((article) => (
                <div 
                  key={article.id}
                  className="flex-shrink-0"
                  style={{ width: '280px', minWidth: '280px', pointerEvents: isDragging ? 'none' : 'auto' }}
                >
                  <article
                    className="bg-white rounded-lg overflow-hidden transition-shadow duration-300 group"
                  >
                    {/* Image Container with Overlay */}
                    <div className="relative w-full h-64 overflow-hidden cursor-pointer">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                      
                      {/* Overlay Elements */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center justify-between">
                          {/* Profile Icon */}
                          <div className="flex items-center gap-2 text-white">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">superuser</span>
                          </div>
                          
                          {/* Share and Comment Icons */}
                          <div className="flex items-center gap-3">
                            <button className="text-white hover:text-gray-200 transition-colors cursor-pointer">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                              </svg>
                            </button>
                            <button className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 cursor-pointer">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="text-sm">0</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Metadata */}
                      <div className="text-sm text-gray-500 mb-3">
                        {article.category} / {article.date}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.description}
                      </p>

                      {/* Continue Reading Link */}
                      <a
                        href="#"
                        className="text-[#5C4977] hover:text-purple-800 font-medium text-sm transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        Continue Reading
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Desktop - Swiper */
          <div className="relative slider-container w-full overflow-hidden slider-group">
            {/* Navigation Buttons */}
            <button 
              className="articles-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg opacity-0 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
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
              className="articles-next absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg opacity-0 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
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
              slidesPerView={4}
              watchOverflow={true}
              resistance={false}
              resistanceRatio={0}
              onSwiper={setSwiperInstance}
              navigation={{
                prevEl: '.articles-prev',
                nextEl: '.articles-next',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="articles-swiper w-full"
            >
              {articles.map((article) => (
                <SwiperSlide key={article.id}>
                  <article className="bg-white rounded-lg overflow-hidden transition-shadow duration-300 group h-full">
                    {/* Image Container with Overlay */}
                    <div className="relative w-full h-64 overflow-hidden cursor-pointer">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                      
                      {/* Overlay Elements */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center justify-between">
                          {/* Profile Icon */}
                          <div className="flex items-center gap-2 text-white">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">superuser</span>
                          </div>
                          
                          {/* Share and Comment Icons */}
                          <div className="flex items-center gap-3">
                            <button className="text-white hover:text-gray-200 transition-colors cursor-pointer">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                              </svg>
                            </button>
                            <button className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 cursor-pointer">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="text-sm">0</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Metadata */}
                      <div className="text-sm text-gray-500 mb-3">
                        {article.category} / {article.date}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.description}
                      </p>

                      {/* Continue Reading Link */}
                      <a
                        href="#"
                        className="text-[#5C4977] hover:text-purple-800 font-medium text-sm transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        Continue Reading
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
      </Container>
      
      {/* Custom Styles */}
      <style jsx="true">{`
        /* Horizontal scrollbar styling */
        .articles-scroll {
          margin-top: 12px;
          padding-top: 12px;
        }
        
        .articles-scroll::-webkit-scrollbar {
          height: 10px;
        }
        
        .articles-scroll::-webkit-scrollbar-track {
          background: #ffffff;
          border-radius: 10px;
        }
        
        .articles-scroll::-webkit-scrollbar-thumb {
          background: #5C4977;
          border-radius: 10px;
        }
        
        .articles-scroll::-webkit-scrollbar-thumb:hover {
          background: #4a3a62;
        }
        
        .articles-scroll {
          scrollbar-width: auto;
          scrollbar-color: #5C4977 #ffffff;
        }
        
        /* Slider group hover for navigation buttons */
        .slider-group:hover .articles-prev,
        .slider-group:hover .articles-next {
          opacity: 1;
        }
        
        /* Swiper wrapper padding */
        .articles-swiper .swiper-wrapper {
          padding-bottom: 10px;
        }
      `}</style>
    </section>
  );
};

export default Blog;

