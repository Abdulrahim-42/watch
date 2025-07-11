import React, { useRef, useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const VideoOverlay = () => {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const [scale, setScale] = useState(1)

  // Scroll əsasında scale dəyərini hesablayan efekt
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Section tam ekrana girəndə rect.top ~ 0 olur
      // 0-dan -(height) qədər keçid üçün progress hesabı
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1)

      // 1-dən 0.9-a qədər kiçiltmə (maksimum 10%)
      const newScale = 1 - progress * 0.1
      setScale(newScale)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Səsi toggle edən funksiya
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="object-cover w-full h-full"
        autoPlay
        loop
        muted={isMuted}
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        <source src="/watch.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay yazı */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center container mx-auto justify-center bg-opacity-30">
        <div className="text-center div-v px-4">
          <h1 className="text-white text-4xl md:text-6xl   mb- drop-shadow-lg">
            ARTEMIS TUMBLER
          </h1>
          <p className="text-white py-5 text-lg md:text-2xl drop-shadow-md">
            Yeni saat kolleksiyamızla tanış olun.
          </p>
           <div className="button-overlay flex items-center justify-center">
            <button className="bg-white text-black px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 flex justify-center">
                    <h3 className="shop-text">Shop Now</h3>
                  </button>
           </div>
        </div>
      </div>

      {/* Səs ikonu */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-20 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  )
}

export default VideoOverlay
