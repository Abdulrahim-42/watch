import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import '../assets/css/HeroSection.css';

import 'swiper/css';
import 'swiper/css/pagination';

const CountdownBox = ({ value, label }) => (
  <div className="backdrop-blur-sm bg-white rounded-md p-2 w-14 text-center shadow-sm">
    <span className="text-2xl font-bold text-gray-900 block">{value}</span>
    <span className="text-xs uppercase text-gray-600">{label}</span>
  </div>
);

export default function ProductBanners() {
  const slides = [
    {
      id: 1,
      title: "Apple Shopping Event",
      description: "Shop great deals on MacBook, iPad, iPhone and more.",
      buttonText: "Shop Now",
      bgClass: "bg-img"
    },
    {
      id: 2,
      title: "New iPhone 15 Pro",
      description: "Discover the revolutionary titanium design.",
      buttonText: "Learn More",
      bgClass: "bg-img-2"
    },
    {
      id: 3,
      title: "MacBook Air M3",
      description: "Supercharged by the next-generation M3 chip.",
      buttonText: "Buy Now",
      bgClass: "bg-img-3"
    }
  ];

  return (
    // Ana container - mobilde de kenar boşlukları olacak
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* --- 1. Left Column (Apple Banner with Swiper) --- */}
        <div className="lg:w-[750px] w-full">
          <div className="relative rounded-xl overflow-hidden h-full min-h-[500px]">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                el: '.custom-pagination',
                bulletClass: 'custom-bullet',
                bulletActiveClass: 'custom-bullet-active'
              }}
              loop={true}
              className="h-full"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className={`${slide.bgClass} text-white p-6 md:p-12 rounded-xl h-full flex flex-col justify-center items-center min-h-[500px] relative`}>
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/20 z-0"></div>
                    
                    <div className="relative z-10 text-center max-w-2xl">
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-5">
                        {slide.title}
                      </h2>
                      <p className="text-base md:text-lg text-gray-200 mb-6">
                        {slide.description}
                      </p>
                      <button className="bg-[#5C4977] hover:bg-[#5C4977]/90 text-white font-semibold py-2 md:py-3 px-6 md:px-8 rounded-md transition-colors duration-300 text-sm md:text-base">
                        {slide.buttonText}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 z-20">
              <div className="flex justify-center">
                <div className="custom-pagination flex gap-2 bg-white rounded-full p-1 shadow-lg w-auto px-4"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* --- 2. Right Column (contains 3 cards) --- */}
        <div className="lg:flex-1 flex flex-col gap-6">
          
          {/* Card 2.1: Aurora Headset */}
          <div className="relative bg-qulaq p-6 rounded-xl overflow-hidden h-[300px]">
            <div className="absolute top-0 right-0 w-2/3 h-full -mr-8 opacity-80">
              {/* Place your headset image here */}
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <h3 className="text-xl md:text-2xl font-bold text-white">Aurora Headset</h3>
              <div>
                <div className="flex gap-2 mb-4">
                  <CountdownBox value="52" label="Days" />
                  <CountdownBox value="06" label="Hr" />
                  <CountdownBox value="33" label="Min" />
                  <CountdownBox value="08" label="Sec" />
                </div>
                <button className="bg-[#53426B] hover:bg-[#53426B]/90 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 text-sm md:text-base">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Row for the two bottom cards */}
          <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Card 2.2: New Dual Sense */}
            <div className="bg-ps4 text-white p-6 rounded-xl flex-1 min-h-[200px]">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-2">New Dual Sense</h3>
                  <p className="text-sm text-blue-100 mb-4">For PlayStation 5</p>
                  <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-2 px-4 md:px-5 rounded-md text-sm transition-colors duration-300">
                    View Details
                  </button>
                </div>
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20">
                  {/* Place controller image here */}
                </div>
              </div>
            </div>
            
            {/* Card 2.3: Instant Cameras */}
            <div className="bg-cam text-gray-900 p-6 rounded-xl flex-1 min-h-[200px]">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-2">Instant Cameras</h3>
                  <p className="text-sm text-gray-700 mb-4">Get photo paper as a gift</p>
                  <button className="bg-white text-yellow-800 hover:bg-gray-100 font-semibold py-2 px-4 md:px-5 rounded-md text-sm transition-colors duration-300">
                    View Details
                  </button>
                </div>
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20">
                  {/* Place camera image here */}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Custom CSS for pagination bullets */}
      <style jsx>{`
        .custom-pagination {
          display: flex !important;
          justify-content: center;
          align-items: center;
          width: auto !important;
          min-width: 80px;
          position: static !important;
          transform: none !important;
          background: white;
          border-radius: 9999px;
          padding: 6px 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .custom-bullet {
          width: 8px;
          height: 8px;
          background-color: #9ca3af;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 4px;
          opacity: 0.7;
        }
        .custom-bullet-active {
          background-color: #5C4977;
          width: 24px;
          border-radius: 6px;
          opacity: 1;
        }
        .custom-bullet:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}