import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Home,
  Plus,
  Edit,
  UserCheck,
  Tag
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlice';
import { useLazyLogoutQuery } from '../../redux/api/authApi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [triggerLogout] = useLazyLogoutQuery();

  // User data from Redux - NAVBAR-DAKI KIMI
  const userState = useSelector(state => state.user || state.userSlice || state.auth);
  const { user, isAuthenticated } = userState || {};

  // Quick actions - only functional paths
  const quickActions = [
    { icon: <Plus size={20} />, label: 'Məhsul əlavə et', path: '/admin/add-products' },
    { icon: <Edit size={20} />, label: 'Məhsulları idarə et', path: '/admin/adminproducts' },
    { icon: <FileText size={20} />, label: 'Bloq yazısı əlavə et', path: '/admin/add-blog' },
    { icon: <UserCheck size={20} />, label: 'İstifadəçilər', path: '/admin/users' },
  ];

  // Get user info safely - NAVBAR-DAKI EYNI FUNKSIYALAR
  const getUserName = () => {
    return user?.user?.name || user?.name || user?.username || "Admin"
  }

  const getUserEmail = () => {
    return user?.user?.email || user?.email || "admin@example.com"
  }

  const getUserAvatar = () => {
    return user?.user?.avatar?.url || user?.avatar?.url || user?.profilePicture || ""
  }

  const getUserRole = () => {
    return user?.user?.role || user?.role || "admin"
  }

  // Logout function - NAVBAR-DAKI EYNI LOGIKA
  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, still logout locally
      dispatch(logout());
      navigate('/');
    }
  };

  // Check if user is admin - if not, redirect to home
  React.useEffect(() => {
    const userRole = getUserRole();
    if (userRole !== "admin") {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-[#5C4977]" />
              Admin Panel
            </h1>
            <p className="text-sm text-gray-500 mt-1">İdarəetmə Paneli</p>
          </div>

          {/* User info - NAVBAR-DAKI MƏLUMATLAR ILE */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {getUserAvatar() ? (
                <img
                  src={getUserAvatar()}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-full border-2 border-[#5C4977]"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-[#5C4977] to-[#8B699B] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {getUserName().charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800">{getUserName()}</h3>
                <p className="text-sm text-gray-500 truncate max-w-[150px]">{getUserEmail()}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-[#5C4977]/10 text-[#5C4977] rounded-full font-medium">
                  {getUserRole() === "admin" ? "Admin" : "İstifadəçi"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-[#5C4977] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'}`}
            >
              <Home size={20} />
              <span className="font-medium">Dashboard</span>
            </button>

            <Link
              to="/admin/adminproducts"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <Package size={20} />
              <span className="font-medium">Məhsullar</span>
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <Tag size={20} />
              <span className="font-medium">Kateqoriyalar</span>
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <ShoppingCart size={20} />
              <span className="font-medium">Sifarişlər</span>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <Users size={20} />
              <span className="font-medium">İstifadəçilər</span>
            </Link>

            <Link
              to="/admin/admin-blogs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <FileText size={20} />
              <span className="font-medium">Bloq</span>
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <Settings size={20} />
              <span className="font-medium">Tənzimləmələr</span>
            </Link>
          </nav>

          {/* Logout button - NAVBAR-DAKI LOGOUT SİSTEMİ ILE */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors w-full font-medium"
            >
              <LogOut size={20} />
              <span>Çıxış</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main content */}
      <main className={`lg:ml-64 pt-16 lg:pt-0 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top bar - NAVBAR-DAKI USER MƏLUMATLARI ILE */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600">Xoş gəlmisiniz, {getUserName()} 👋</p>
              </div>
              
              <div className="flex items-center gap-4">
               
                
                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  {getUserAvatar() ? (
                    <img
                      src={getUserAvatar()}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-cover rounded-full border-2 border-[#5C4977]"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-[#5C4977] to-[#8B699B] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getUserName().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[120px]">{getUserName()}</p>
                    <p className="text-xs text-gray-500">
                      {getUserRole() === "admin" ? "Admin" : "İstifadəçi"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tez Hərəkətlər</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center hover:border-[#5C4977] group"
                >
                  <div className="p-3 bg-[#5C4977]/10 rounded-lg mb-3 group-hover:bg-[#5C4977]/20 transition-colors">
                    <div className="text-[#5C4977]">{action.icon}</div>
                  </div>
                  <span className="font-medium text-gray-800 group-hover:text-[#5C4977] transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Information Message */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-[#5C4977]/10 rounded-lg flex items-center justify-center">
                  <BarChart3 size={24} className="text-[#5C4977]" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin Dashboard</h3>
                <p className="text-gray-600 mb-3">
                  Admin panelinə xoş gəlmisiniz. Dashboard funksionallığını aktiv etmək üçün backend API endpoint-lərini tətbiq etməlisiniz.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tələb olunan API endpoint-ləri:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-700">
                    <li>• Admin statistikası (totalUsers, totalOrders, totalRevenue, etc.)</li>
                    <li>• Son sifarişlər siyahısı</li>
                    <li>• Məhsul statistikaları</li>
                    <li>• Fəaliyyət jurnalı</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;