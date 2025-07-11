"use client"

import { useState } from "react"

export default function ProductCards() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const products = [
    {
      id: 1,
      name: "Aero",
      brand: "Velocità",
      specifications: "Automatic, Ø 41mm, Black",
      price: 250.0,
      image: "/pic1.jpg",
    },
    {
      id: 2,
      name: "Corsa",
      brand: "Velocità",
      specifications: "Quartz Chronograph, Ø 44mm, Leather",
      price: 430.0,
      originalPrice: 520.0,
      image: "/pic2.png",
    },
    {
      id: 3,
      name: "Strada",
      brand: "Velocità",
      specifications: "Automatic, Ø 42mm, Black",
      price: 360.0,
      image: "/pic3s.png",
    },
    {
      id: 4,
      name: "Monaco",
      brand: "Velocità",
      specifications: "Manual Wind, Ø 39mm, Steel",
      price: 180.0,
      image: "/pic4.png",
    },
  ]

  const handleAddToCart = (product) => {
    alert(`Added ${product.brand} ${product.name} to cart!`)
  }

  const toggleWishlist = (productId) => {
    console.log(`Toggled wishlist for product ${productId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Luxury Timepieces</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection of premium watches, crafted with precision and designed for the modern connoisseur.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.brand} ${product.name}`}
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 ${
                    hoveredCard === product.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-gray-600 hover:text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>

                {/* Sale Badge */}
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded">
                    SALE
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-3">
                {/* Brand and Name */}
                <div className="space-y-1">
                  <h3 className="text-lg leading-tight">
                    <span className="italic text-gray-800 font-serif">{product.brand}</span>{" "}
                    <span className="font-normal">{product.name}</span>
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">{product.specifications}</p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 font-medium tracking-wide transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                    />
                  </svg>
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-gray-900 text-white px-8 py-3 font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300">
            VIEW ALL COLLECTIONS
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free worldwide shipping on all orders over $200</p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">2 Year Warranty</h3>
            <p className="text-gray-600">Comprehensive warranty coverage for peace of mind</p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75A9.75 9.75 0 0112 2.25z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600">24/7 customer support from watch specialists</p>
          </div>
        </div>
      </div>
    </div>
  )
}
