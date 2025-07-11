import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const Hero = () => {
  return (
    <>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          enabled: false // Disableds by default
        }}
        loop
        className="mySwiper"
        breakpoints={{
          // Enable navigation and disable pagination on 768px and up
          768: {
            pagination: {
              enabled: false
            },
            navigation: {
              enabled: true
            }
          },
          // Adjust settings for 1024px if needed
          1024: {
            navigation: {
              enabled: true
            },
             pagination: {
              enabled: false
            },
            
          }
        }}
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="hero-1">
            <div className="bg-watch">
              <div className="container mx-auto">
                <h1 className="playfair-display text-white percents">OPENING SALE</h1>
                <h1 className="playfair-display text-white percent-">
                  Take <span className="tab-a">50%</span> Off
                </h1>
                <div className="btn-div flex items-center justify-center shop-i5">
                  <button className="bg-white text-black px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 flex justify-center">
                    <h3 className="shop-text">Shop Now</h3>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-watch-mobile">
              <div className="container mx-auto">
                <h1 className="playfair-display text-white percents">OPENING SALE</h1>
                <h1 className="playfair-display text-white percent-">
                  Take <span className="">50%</span> Off
                </h1>
                <div className="btn-div flex items-center justify-center shop-i5 boba">
                  <button className="bg-white text-black px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 flex justify-center">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="hero-2">
            <div className="bg-watch-2">
              <div className="container mx-auto">
                <h1 className="playfair-display text-white percents">ORIGINAL DEALS</h1>
                <h1 className="playfair-display text-white percent-">
                 Good <span className="tab-">Quality</span> Watches
                </h1>
                <div className="btn-div flex items-center justify-center shop-i5">
                  <button className="bg-white text-black px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 flex justify-center">
                    <h3 className="shop-text">Shop Now</h3>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-watch-mobile-2">
              <div className="container mx-auto">
                <h1 className="playfair-display text-white percents">ORIGINAL DEALS</h1>
                <h1 className="playfair-display text-white percent-">
                 Good <br /><span className="">Quality</span> <br />Watches
                </h1>
                <div className="btn-div flex items-center justify-center shop-i5 boba">
                  <button className="bg-white text-black px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 flex justify-center">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        
        {/* Navigation buttons - will only show on screens >= 768px */}
        <div className="swiper-button-prev" style={{ top: '40%' }}></div>
        <div className="swiper-button-next" style={{ top: '40%' }}></div>
      </Swiper>
      
      {/* Custom CSS for navigation buttons */}
      <style jsx>{`
        @media (min-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            top: 49% !important;
            color:#BD8334;
          }
        }
      `}</style>
    </>
  )
}

export default Hero