import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '../components/ui/Container';

import '../assets/css/HeroSection.css';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CountdownBox = ({ value, label }) => (
  <div className="bg-white rounded-md p-1.5 w-12 h-12 text-center shadow-sm flex flex-col items-center justify-center">
    <span className="text-xl font-bold text-gray-700 block leading-tight">{value}</span>
    <span className="text-[9px] uppercase text-gray-500 leading-tight">{label}</span>
  </div>
);

export default function ProductBanners() {
  const swiperRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = React.useState(null);
  const [countdown, setCountdown] = React.useState({
    days: 52,
    hours: 6,
    minutes: 33,
    seconds: 8
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
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
    <Container>
      <div className="w-full my-5">
        <div className="flex flex-col lg:flex-row gap-6">
        
        {/* --- 1. Left Column (Apple Banner with Swiper) --- */}
        <div className="lg:w-[680px]">
          <div className="relative rounded-lg overflow-hidden h-full min-h-[420px] group">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
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
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setSwiperInstance(swiper);
              }}
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className={`${slide.bgClass} text-white p-6 md:p-10 h-full flex flex-col justify-between min-h-[420px]`}>
                    <div className="relative z-10">
                      <h2 className="text-2xl md:text-4xl apas mb-4 text-center">
                        {slide.title}
                      </h2>
                      <p className="text-base text-gray-300 mb-5 text-center">
                        {slide.description}
                      </p>
                      <div className="buton-div flex justify-center items-center">
                        <button className="bg-[#5C4977] hover:bg-[#5C4977]/90 text-white font-semibold py-2 px-6 rounded-md transition-colors flex justify-center items-center text-sm cursor-pointer">
                          {slide.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination Dots */}
            <div className="paginations flex justify-center items-center absolute bottom-4 left-0 right-0 z-20">
              <div className="custom-pagination flex gap-2 bg-white rounded-full p-1 shadow-md w-auto px-3"></div>
            </div>
            
            {/* Custom Navigation Buttons */}
            <button 
              className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperInstance) {
                  swiperInstance.slidePrev();
                }
              }}
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button 
              className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperInstance) {
                  swiperInstance.slideNext();
                }
              }}
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
        
        {/* --- 2. Right Column (contains 3 cards) --- */}
        <div className="lg:flex-1 flex flex-col gap-6">
          
          {/* Card 2.1: Aurora Headset */}
          <div className="relative bg-qulaq p-5 rounded-xl overflow-hidden h-[250px] group">
            <img 
              src="/images/hero1/logitech-aurora-headset-opt.png" 
              alt="Aurora Headset"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="relative z-10 px-1">
              <h3 className="text-[23px] font-bold text-white mt-5 mb-4">Aurora Headset</h3>
              <div className="flex gap-2 mb-4">
                <CountdownBox value={countdown.days.toString().padStart(2, '0')} label="Days" />
                <CountdownBox value={countdown.hours.toString().padStart(2, '0')} label="Hr" />
                <CountdownBox value={countdown.minutes.toString().padStart(2, '0')} label="Min" />
                <CountdownBox value={countdown.seconds.toString().padStart(2, '0')} label="Sec" />
              </div>
              <button className="bg-[#5C4977] hover:bg-[#5C4977]/90 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm cursor-pointer">
                Buy Now
              </button>
            </div>
          </div>
          
          {/* Row for the two bottom cards */}
          <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Card 2.2: New Dual Sense */}
            <div className="bg-ps4 text-white p-5 rounded-xl flex-1 h-[170px] relative overflow-hidden group">
              <img 
                src="/images/hero1/new-dualsense.png" 
                alt="New Dual Sense"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="flex items-center justify-between space-x-4 h-full relative z-10">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-bold">New Dual Sense</h3>
                    <p className="text-xs text-blue-100 mb-3">For PlayStation 5</p>
                  </div>
                  <button className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-md text-xs hover:bg-gray-100 transition-colors cursor-pointer">
                    View Details
                  </button>
                </div>
                <div className="flex-shrink-0">
                  {/* You would place your <img /> tag here */}
                </div>
              </div>
            </div>
            
            {/* Card 2.3: Instant Cameras */}
            <div className="bg-cam text-gray-900 p-5 rounded-xl flex-1 h-[170px] relative overflow-hidden group">
              <img 
                src="/images/hero1/instant-cameras.png" 
                alt="Instant Cameras"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="flex items-center justify-between space-x-4 h-full relative z-10">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-bold">Instant Cameras</h3>
                    <p className="text-xs text-gray-700 mb-3">Get photo paper as a gift</p>
                  </div>
                  <button className="bg-white text-yellow-800 font-semibold py-2 px-4 rounded-md text-xs hover:bg-gray-100 transition-colors cursor-pointer">
                    View Details
                  </button>
                </div>
                <div className="flex-shrink-0">
                  {/* You would place your <img /> tag here */}
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
          padding: 6px 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .custom-bullet {
          width: 8px;
          height: 8px;
          background-color: #6b7280;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 3px;
        }
        .custom-bullet-active {
          background-color: #5C4977;
          width: 10px;
          border-radius: 6px;
        }
      `}</style>
      </div>
    </Container>
  );
}

