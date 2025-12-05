import { useState, useEffect, useRef } from "react"
import { Search, Menu, X, Phone, Globe, User, Heart, ShoppingCart, ChevronDown, Package, LogOut } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { logout } from "../redux/features/userSlice"
import { useLazyLogoutQuery } from "../redux/api/authApi"
import {
  useGetCartQuery,
  useGetFavoritesQuery,
  useSearchProductsQuery,
} from "../redux/api/productsApi"
import SebetCart from "./ShoppingCard"

// Desktop üçün İstifadəçi Menyusu
const UserMenu = ({ name, email, imageUrl, role, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center text-black hover:text-[#5C4977] transition-colors duration-200 p-2 rounded-lg cursor-pointer"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            width={32}
            height={32}
            className="h-8 w-8 object-cover rounded-full border-2 border-[#5C4977]"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center bg-[#5C4977] text-white rounded-full border-2 border-[#5C4977]">
            {name && name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-white shadow-2xl border border-[#5C4977]/20 rounded-xl py-3 z-50">
          <div className="px-4 pb-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
          
          {/* Yalnız adminlər üçün Admin Dashboard linki */}
          {role === "admin" && (
            <div className="mt-2">
              <Link
                to="/admin/admin-dashboard"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#5C4977] hover:bg-[#f5f2fa] cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin Dashboard
              </Link>
            </div>
          )}

          <div className="mt-2">
            <Link
              to="/profile"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-[#f5f2fa] hover:text-[#5C4977] cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profil
            </Link>
          </div>

          <div className="mt-2 border-t border-gray-100 pt-2">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Çıxış
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function MetaShopHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Axtarış state-ləri
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Fərqli store strukturları üçün useSelector
  const userState = useSelector(state => state.user || state.userSlice || state.auth)
  const { user, isAuthenticated } = userState || {}
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [triggerLogout] = useLazyLogoutQuery()

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // RTK Query ilə dinamik axtarış
  const {
    data: searchResults,
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchProductsQuery(
    { query: debouncedSearchQuery },
    { 
      skip: debouncedSearchQuery.trim() === "" || debouncedSearchQuery.length < 2 
    }
  )

  // Səbət və favorit sorğuları
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useGetCartQuery()
  
  const {
    data: favoriteData,
    isLoading: favoriteLoading,
    error: favoriteError,
  } = useGetFavoritesQuery()

  // Səbət məhsul sayını hesabla - DÜZƏLDİ (YENİ HƏLL)
  const getCartItemCount = () => {
    if (cartLoading) return 0
    if (cartError) return 0
    
    // Müxtəlif API strukturları üçün yoxlama
    if (cartData?.cart?.items && Array.isArray(cartData.cart.items)) {
      // Struktur: { cart: { items: [...] } }
      const validItems = cartData.cart.items.filter(item => item?.product)
      return validItems.reduce((total, item) => total + (item.quantity || 1), 0)
    } else if (cartData?.items && Array.isArray(cartData.items)) {
      // Struktur: { items: [...] }
      const validItems = cartData.items.filter(item => item?.product)
      return validItems.reduce((total, item) => total + (item.quantity || 1), 0)
    } else if (Array.isArray(cartData?.cart)) {
      // Struktur: { cart: [...] }
      const validItems = cartData.cart.filter(item => item?.product)
      return validItems.reduce((total, item) => total + (item.quantity || 1), 0)
    } else if (Array.isArray(cartData)) {
      // Struktur: [...]
      const validItems = cartData.filter(item => item?.product)
      return validItems.reduce((total, item) => total + (item.quantity || 1), 0)
    }
    
    return 0
  }

  // Favorit məhsul sayını hesabla - DÜZƏLDİ
  const getFavoriteItemCount = () => {
    if (favoriteLoading) return 0
    if (favoriteError) return 0
    
    // Müxtəlif API strukturları üçün yoxlama
    if (favoriteData?.favorites && Array.isArray(favoriteData.favorites)) {
      return favoriteData.favorites.length
    } else if (Array.isArray(favoriteData)) {
      return favoriteData.length
    }
    
    return 0
  }

  // Axtarış funksiyası
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
      setShowSuggestions(false)
    }
  }

  // Input focus/unfocus handler
  const handleSearchFocus = () => {
    setShowSuggestions(true)
  }

  const handleSearchBlur = () => {
    // Kiçik gecikmə ilə suggestions gizlət ki, klik işləyə bilsin
    setTimeout(() => setShowSuggestions(false), 200)
  }

  // Axtarış nəticələrini göstər
  const renderSearchSuggestions = () => {
    if (!showSuggestions || debouncedSearchQuery.trim() === "" || debouncedSearchQuery.length < 2) return null
    const defaultImageUrl = "https://via.placeholder.com/300"
    
    return (
      <div className="absolute top-full left-0 right-0 bg-white shadow-2xl border border-[#5C4977]/20 rounded-xl mt-2 max-h-60 overflow-y-auto z-50">
        {searchLoading ? (
          <div className="p-4 text-gray-500 text-center">Yüklənir...</div>
        ) : searchError ? (
          <div className="p-4 text-red-500 text-center">Xəta baş verdi</div>
        ) : searchResults?.products?.length > 0 ? (
          <>
            {searchResults.products.slice(0, 8).map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="flex items-center gap-3 p-3 hover:bg-[#f5f2fa] transition-colors border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  setSearchQuery("")
                  setShowSuggestions(false)
                  setIsSearchOpen(false)
                }}
              >
                <img
                  src={product?.images?.[0]?.url || defaultImageUrl}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-[#5C4977]">{product.name}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {product.category} • {product.price?.toFixed(2)} ₼
                  </div>
                </div>
              </Link>
            ))}
            {/* Bütün nəticələri göstər linki */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => {
                  navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`)
                  setShowSuggestions(false)
                  setIsSearchOpen(false)
                  setSearchQuery("")
                }}
                className="w-full text-center text-sm text-[#5C4977] font-medium hover:text-[#5C4977]/80 transition-colors"
              >
                Bütün nəticələri göstər ({searchResults.products.length})
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 text-gray-500 text-center">
            "{debouncedSearchQuery}" üçün nəticə tapılmadı
          </div>
        )}
      </div>
    )
  }

  const categories = [
    {
      name: "Smartfonlar, Planşet və Qadjetlər",
      subcategories: [
        "Smartfonlar",
        "Planşetlər",
        "Aksesuarlar",
        "Smart saatlar və fitnes-breloklar",
        "Qulaqlıqlar",
        "Powerbank-lər",
        "Telefon üçün ehtiyat hissələr",
      ],
    },
    {
      name: "Noutbuklar, Kompüterlər, Ofis",
      subcategories: [
        "Noutbuklar",
        "Kompüter toplamaq üçün komponentlər",
        "Monobloklar",
        "Monitorlar",
        "Aksesuarlar",
        "Printerlər və MFP-lər",
        "Proyektorlar",
        "Ofis avadanlıqları",
      ],
    },
    {
      name: "TV, Audio, Video, Foto",
      subcategories: [
        "Televizorlar",
        "Audio sistemlər",
        "Fotoaparatlar",
        "Video kameralar",
        "Objektivlər",
        "Foto aksesuarlar",
        "TV və audio aksesuarlar",
      ],
    },
    {
      name: "Məişət texnikası",
      subcategories: [
        "Soyuducular",
        "Paltaryuyan maşınlar",
        "Kondisionerlər",
        "Qaz plitələr",
        "Elektrik sobalar",
        "Mikrodalğalı sobalar",
        "Tozsoranlar",
        "Ütülər",
      ],
    },
    {
      name: "Oyun və Əyləncə",
      subcategories: [
        "Oyun konsolları",
        "Oyunlar",
        "Geyming aksesuarlar",
        "Virtual reallıq başlıqları",
        "Geyming stolları və kreslolar",
      ],
    },
    {
      name: "Şəbəkə avadanlıqları",
      subcategories: ["Routerlər", "Modemlər", "Wi-Fi adapterlər", "Şəbəkə saxlayıcıları", "İnternet kabeli"],
    },
  ]

  const handleSubcategoryClick = (subcategoryName) => {
    console.log("Seçildi:", subcategoryName)
    setIsCategoriesOpen(false)
    setExpandedCategory(null)
    setIsMobileMenuOpen(false)
  }

  const handleLoginClick = () => {
    navigate('/login')
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  const handleRegisterClick = () => {
    navigate('/register')
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap()
      dispatch(logout())
      setIsUserMenuOpen(false)
      setIsMobileMenuOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  const handleFavoritesClick = () => {
    navigate('/favourites')
    setIsMobileMenuOpen(false)
  }

  const handleShoppingCartClick = () => {
    setIsCartOpen(true)
    setIsMobileMenuOpen(false)
  }

  const handleHomeClick = () => {
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  // Get user info safely - bütün mümkün strukturları yoxla
  const getUserName = () => {
    return user?.user?.name || user?.name || user?.username || "İstifadəçi"
  }

  const getUserEmail = () => {
    return user?.user?.email || user?.email || ""
  }

  const getUserAvatar = () => {
    return user?.user?.avatar?.url || user?.avatar?.url || user?.profilePicture || ""
  }

  const getUserRole = () => {
    return user?.user?.role || user?.role || "user"
  }

  // Əgər user state undefined-dırsa, default dəyərlər istifadə et
  const safeIsAuthenticated = isAuthenticated || false
  const safeUser = user || {}

  return (
    <div className="w-full bg-white">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white">
        {/* Main Header */}
        <div className="max-w-[1400px] mx-auto py-4 px-4 sm:px-6">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/images/logo.svg" 
                alt="META SHOP Logo" 
                className="h-14 cursor-pointer"
                onClick={handleHomeClick}
              />
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl">
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Məhsul axtar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className="w-full px-5 py-2 pl-12 bg-white rounded-full text-base text-[#5c4977] placeholder-[#5c4977]/50 focus:outline-none focus:ring-2 focus:ring-[#5c4977] focus:bg-white transition-colors border border-[#5c4977]/30"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5c4977]" />
                  {renderSearchSuggestions()}
                </form>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-8">
              <div className="flex gap-8">
                <a href="tel:+994123101010" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <Phone className="w-6 h-6 text-gray-700" />
                  <div>
                    <div className="text-black text-sm font-bold">24/7 Dəstək</div>
                    <div className="text-blue-600 text-sm">+994 12 310 10 10</div>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-gray-700" />
                  <div>
                    <div className="text-black text-sm font-bold">Bütün ölkə üzrə</div>
                    <div className="text-blue-600 text-sm">Pulsuz çatdırılma</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-2">
              {/* Left Navigation */}
              <div className="flex items-center gap-6">
                {/* Categories Dropdown */}
                <div className="relative">
                  <div
                    className="flex items-center gap-3 px-4 py-2 transition-all duration-300 cursor-pointer select-none"
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  >
                    <button className="flex items-center justify-center w-11 h-11 rounded-full bg-[#5C4977] text-white hover:bg-[#5C4977]/90 transition-all duration-300 shadow-md shadow-[#5C4977]/30 hover:shadow-[#5C4977]/50 border border-[#5C4977] cursor-pointer">
                      <Menu className="w-5 h-5 cursor-pointer" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-[#5C4977] select-none cursor-pointer">Bütün Kateqoriyalar</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#5C4977]/70 transition-transform duration-300 cursor-pointer ${
                          isCategoriesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isCategoriesOpen && (
                    <div className="absolute top-full left-0 w-80 bg-white shadow-2xl border border-[#5C4977]/20 rounded-2xl mt-2 z-50 overflow-hidden transition-all duration-300">
                      <div className="p-4 max-h-96 overflow-y-auto">
                        {categories.map((category, index) => (
                          <div key={index} className="mb-2 last:mb-0">
                            <button
                              onClick={() =>
                                setExpandedCategory(expandedCategory === index ? null : index)
                              }
                              className="flex items-center justify-between w-full p-3 hover:bg-[#f5f2fa] rounded-xl cursor-pointer group transition-all select-none"
                            >
                              <span className="font-medium text-[#5C4977] text-left flex-1 select-none">
                                {category.name}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-[#5C4977]/60 transition-transform duration-300 ${
                                  expandedCategory === index ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {expandedCategory === index && (
                              <div className="ml-4 mt-2 space-y-1">
                                {category.subcategories.map((subcategory, subIndex) => (
                                  <button
                                    key={subIndex}
                                    onClick={() => handleSubcategoryClick(subcategory)}
                                    className="block w-full text-left px-3 py-2 text-sm text-[#5C4977]/80 hover:text-[#5C4977] hover:bg-[#f3effa] rounded-lg transition-all select-none"
                                  >
                                    {subcategory}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <nav className="flex items-center gap-0">
                  <button className="px-5 py-2 rounded-full transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border-none text-base font-medium cursor-pointer select-none">
                    Aksiyalar
                  </button>
                  <button className="px-5 py-2 rounded-full transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border-none text-base font-medium cursor-pointer select-none">
                    Mağazalar
                  </button>
                  <button className="px-5 py-2 rounded-full transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border-none text-base font-medium cursor-pointer select-none">
                    Bizimlə Əlaqə
                  </button>
                  <button className="px-5 py-2 rounded-full transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border-none text-base font-medium cursor-pointer select-none">
                    Çatdırılma & Geri Qaytarılma
                  </button>
                </nav>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-6">
                {/* User Menu */}
                {safeIsAuthenticated ? (
                  <UserMenu
                    name={getUserName()}
                    email={getUserEmail()}
                    imageUrl={getUserAvatar()}
                    role={getUserRole()}
                    onLogout={handleLogout}
                  />
                ) : (
                  <div className="relative">
                    <button 
                      className="flex items-center justify-center text-black hover:text-[#5C4977] transition-colors duration-200 p-2 rounded-lg cursor-pointer"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      <User className="w-6 h-6" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute top-full right-0 w-48 bg-white shadow-2xl border border-[#5C4977]/20 rounded-xl mt-2 z-50 overflow-hidden">
                        <button
                          onClick={handleLoginClick}
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#f5f2fa] hover:text-[#5C4977] transition-colors cursor-pointer"
                        >
                          Giriş
                        </button>
                        <button
                          onClick={handleRegisterClick}
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#f5f2fa] hover:text-[#5C4977] transition-colors cursor-pointer"
                        >
                          Qeydiyyat
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Favorites */}
                <button 
                  className="relative flex items-center justify-center text-black hover:text-[#5C4977] transition-colors duration-200 p-2 rounded-lg cursor-pointer"
                  onClick={handleFavoritesClick}
                >
                  <Heart className="w-6 h-6" />
                  {getFavoriteItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-[#5C4977] text-xs font-bold rounded-full border border-gray-300 shadow-lg">
                      {getFavoriteItemCount()}
                    </span>
                  )}
                </button>

                {/* Shopping Cart - DÜZƏLDİ (YENİ HƏLL) */}
                <button 
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#5C4977] hover:bg-[#5C4977]/90 transition-colors duration-200 cursor-pointer p-0"
                  onClick={handleShoppingCartClick}
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-[#5C4977] text-xs font-bold rounded-full border border-gray-300 shadow-lg">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-2 flex justify-between items-center text-xs">
            <a href="tel:+994123101010" className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <Phone className="w-3 h-3 text-gray-700" />
              <span className="text-blue-600">+994 12 310 10 10</span>
            </a>

            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-700" />
              <span className="text-blue-600">Pulsuz çatdırılma</span>
            </div>
          </div>
        </div>

        {/* Main Mobile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img 
                  src="/images/logo.svg" 
                  alt="META SHOP Logo" 
                  className="h-10 cursor-pointer"
                  onClick={handleHomeClick}
                />
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-600 hover:text-purple-900 cursor-pointer"
                >
                  <Search className="w-5 h-5 cursor-pointer" />
                </button>

                {/* Shopping Cart - DÜZƏLDİ (YENİ HƏLL) */}
                <button 
                  className="relative p-2 text-gray-600 hover:text-purple-900 cursor-pointer"
                  onClick={handleShoppingCartClick}
                >
                  <ShoppingCart className="w-5 h-5 cursor-pointer" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-[#5C4977] text-xs font-bold rounded-full border border-gray-300 shadow-lg">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-600 hover:text-purple-900 cursor-pointer"
                >
                  <Menu className="w-5 h-5 cursor-pointer" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            {isSearchOpen && (
              <div className="mt-3">
                <div className="relative">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Məhsul axtar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className="w-full px-4 py-3 pl-12 bg-white rounded-full text-base text-[#5c4977] placeholder-[#5c4977]/50 focus:outline-none focus:ring-2 focus:ring-[#5c4977] focus:bg-white transition-colors border border-[#5c4977]/30"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5c4977]" />
                    {renderSearchSuggestions()}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'transform translate-x-0' : 'transform -translate-x-full pointer-events-none'
        }`}>
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <img 
              src="/images/logo.svg" 
              alt="META SHOP Logo" 
              className="h-8 cursor-pointer"
              onClick={handleHomeClick}
            />
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 cursor-pointer">
              <X className="w-6 h-6 cursor-pointer text-gray-600 hover:text-[#5C4977] transition-all duration-300" />
            </button>
          </div>

          <div className="h-screen overflow-y-auto pb-20">
            {/* User Section - ORİJİNAL YAPIDAN SADƏCƏ ADMIN ÜÇÜN DƏYİŞİKLİK */}
            <div className={`px-4 py-3 border-b border-gray-200 ${safeIsAuthenticated && getUserRole() === "admin" ? "bg-gradient-to-r from-[#f8f7fa] to-[#f0edf5]" : "bg-gray-50"}`}>
              {safeIsAuthenticated ? (
                <div className="flex items-center gap-3">
                  {getUserAvatar() ? (
                    <img
                      src={getUserAvatar()}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#5C4977]"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#5C4977] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getUserName().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{getUserName()}</div>
                    <div className="text-xs text-gray-500">{getUserEmail()}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Çıxış
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleLoginClick}
                    className="flex-1 px-4 py-2 bg-[#5C4977] text-white rounded-lg text-sm font-medium hover:bg-[#5C4977]/90 transition-colors cursor-pointer"
                  >
                    Giriş
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="flex-1 px-4 py-2 border border-[#5C4977] text-[#5C4977] rounded-lg text-sm font-medium hover:bg-[#5C4977] hover:text-white transition-colors cursor-pointer"
                  >
                    Qeydiyyat
                  </button>
                </div>
              )}
            </div>

            {/* Admin Dashboard Link for Mobile */}
            {safeIsAuthenticated && getUserRole() === "admin" && (
              <div className="border-b border-gray-200">
                <Link
                  to="/admin/admin-dashboard"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#5C4977] hover:bg-[#f5f2fa] border-b border-gray-100 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            )}

            {/* Categories */}
            <div className="border-b border-gray-200">
              <button
                className="flex items-center justify-between w-full px-4 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                <span>Bütün Kateqoriyalar</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 cursor-pointer ${isCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCategoriesOpen && (
                <div className="bg-gray-50 border-t border-gray-200">
                  {categories.map((category, index) => (
                    <div key={index}>
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                        className="flex items-center justify-between w-full px-6 py-3 text-left text-sm font-medium text-gray-900 hover:bg-white border-b border-gray-200 cursor-pointer"
                      >
                        <span>{category.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-300 cursor-pointer ${expandedCategory === index ? "rotate-180" : ""}`}
                        />
                      </button>

                      {expandedCategory === index && (
                        <div className="bg-white border-b border-gray-200">
                          {category.subcategories.map((subcategory, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={() => handleSubcategoryClick(subcategory)}
                              className="block w-full text-left px-8 py-3 text-sm text-gray-700 hover:text-purple-900 hover:bg-purple-50 border-b border-gray-100 cursor-pointer"
                            >
                              {subcategory}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Main Menu Items */}
            <div className="border-b border-gray-200">
              <button
                onClick={handleFavoritesClick}
                className="relative flex items-center justify-between w-full text-left px-4 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 border-b border-gray-200 cursor-pointer"
              >
                <span>Seçilmişlər</span>
                {getFavoriteItemCount() > 0 && (
                  <span className="bg-[#5C4977] text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                    {getFavoriteItemCount()}
                  </span>
                )}
              </button>
              {["Aksiyalar", "Mağazalar", "Bizimlə Əlaqə", "Çatdırılma & Geri Qaytarılma", "Outlet"].map((item, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-4 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 border-b border-gray-200 cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
          <div className="flex items-center justify-around py-2">
            <button 
              className="flex flex-col items-center text-purple-900 hover:text-[#5C4977] transition-all duration-300 cursor-pointer"
              onClick={handleHomeClick}
            >
              <svg className="w-5 h-5 transition-all duration-300 cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs mt-1 font-medium transition-all duration-300 cursor-pointer">Ana səhifə</span>
            </button>

            <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-all duration-300 cursor-pointer">
              <Package className="w-5 h-5 transition-all duration-300 cursor-pointer" />
              <span className="text-xs mt-1 transition-all duration-300 cursor-pointer">Məhsullar</span>
            </button>

            {/* Shopping Cart - DÜZƏLDİ (YENİ HƏLL) */}
            <button 
              className="relative flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-all duration-300 cursor-pointer"
              onClick={handleShoppingCartClick}
            >
              <ShoppingCart className="w-5 h-5 transition-all duration-300 cursor-pointer" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 right-4 flex items-center justify-center w-5 h-5 bg-[#5C4977] text-white text-xs font-bold rounded-full">
                  {getCartItemCount()}
                </span>
              )}
              <span className="text-xs mt-1 transition-all duration-300 cursor-pointer">Səbət</span>
            </button>

            <button 
              className="relative flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-all duration-300 cursor-pointer"
              onClick={handleFavoritesClick}
            >
              <Heart className="w-5 h-5 transition-all duration-300 cursor-pointer" />
              {getFavoriteItemCount() > 0 && (
                <span className="absolute -top-1 right-4 flex items-center justify-center w-5 h-5 bg-[#5C4977] text-white text-xs font-bold rounded-full">
                  {getFavoriteItemCount()}
                </span>
              )}
              <span className="text-xs mt-1 transition-all duration-300 cursor-pointer">Seçilmiş</span>
            </button>

            <button 
              className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-all duration-300 cursor-pointer"
              onClick={() => {
                if (safeIsAuthenticated) {
                  handleProfileClick()
                } else {
                  handleLoginClick()
                }
              }}
            >
              <User className="w-5 h-5 transition-all duration-300 cursor-pointer" />
              <span className="text-xs mt-1 transition-all duration-300 cursor-pointer">Hesab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shopping Cart Modal */}
      <SebetCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}