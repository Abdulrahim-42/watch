"use client"

import { ChevronDown, Search, ShoppingCart, User } from "lucide-react"
import { useState } from "react"

// NO LINK IMPORT - ONLY REGULAR HTML <a> TAGS USED

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const navigationItems = [
    { name: "Brands", href: "#", hasDropdown: true },
    { name: "Collections", href: "#", hasDropdown: true },
    { name: "Men", href: "#", hasDropdown: true },
    { name: "Women", href: "#", hasDropdown: true },
    { name: "New", href: "#", hasDropdown: true },
    { name: "Sale", href: "#", hasDropdown: true },
  ]

  const toggleDropdown = (itemName) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName)
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <div className="w-full">
        {/* Promotional Banner */}
        <div className="bg-blue-600 text-white text-center py-2 px-4">
          <p className="text-sm font-medium">4th of July Sale | 15% off* orders over $199 Code: FREEDOM</p>
        </div>

        {/* Main Navbar */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo Section - USES <a> TAG */}
            <div className="hidden lg:flex justify-center py-4 border-b border-gray-100">
              <a href="/" className="flex items-center">
                <span className="playfair-display text-4xl text-[#bd8334]">
                  VALORE<span className=""> </span>WATCH
                </span>
              </a>
            </div>

            {/* Main Navigation Row */}
            <div className="flex justify-between items-center h-16">
              {/* Left Navigation - ALL LINKS USE <a> TAGS */}
              <div className="hidden lg:flex items-center space-x-8 lg:flex-1 lg:justify-center">
                {navigationItems.map((item) => (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(item.name)}
                          className="flex items-center cursor-pointer  space-x-1 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <span>{item.name}</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>

                        {/* Dropdown Menu - ALL LINKS USE <a> TAGS */}
                        {openDropdown === item.name && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={closeDropdown}></div>
                            <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                              <div className="py-1">
                                <a
                                  href="#"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                  onClick={closeDropdown}
                                >
                                  Option 1
                                </a>
                                <a
                                  href="#"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                  onClick={closeDropdown}
                                >
                                  Option 2
                                </a>
                                <a
                                  href="#"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                  onClick={closeDropdown}
                                >
                                  Option 3
                                </a>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {item.name}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile/Tablet menu button - shown on screens smaller than lg (1024px) */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Center Logo - USES <a> TAG - shown on screens smaller than lg */}
              <div className="flex-1 flex justify-center lg:hidden">
                <a href="/" className="flex items-center">
                  <span className="playfair-display text-xl text-[#bd8334]">
                    VALORE<span className=""> </span>WATCH
                  </span>
                </a>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-4">
                <button className=" cursor-pointer p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </button>
                <button className="p-2 cursor-pointer  rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </button>
                <button className="p-2 cursor-pointer  rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Shopping cart</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Navigation Menu - ALL LINKS USE <a> TAGS */}
            {isMenuOpen && (
              <div className="lg:hidden border-t border-gray-200 py-4">
                <div className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <div key={item.name}>
                      {item.hasDropdown ? (
                        <div>
                          <button
                            onClick={() => toggleDropdown(`mobile-${item.name}`)}
                            className="flex cursor-pointer  items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${openDropdown === `mobile-${item.name}` ? "rotate-180" : ""}`}
                            />
                          </button>

                          {openDropdown === `mobile-${item.name}` && (
                            <div className="mt-2 ml-4 space-y-2">
                              <a
                                href="#"
                                className="block text-gray-600 hover:text-gray-900 py-1"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                Option 1
                              </a>
                              <a
                                href="#"
                                className="block text-gray-600 hover:text-gray-900 py-1"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                Option 2
                              </a>
                              <a
                                href="#"
                                className="block text-gray-600 hover:text-gray-900 py-1"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                Option 3
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={item.href}
                          className="block text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
     
    </div>
  )
}