import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import Home from './pages/Home'
import RegisterForm from './components/Register'
import LoginForm from './components/Login'

// Admin Components
import AddProducts from './components/admin/AddProducts'
import AdminProducts from './components/admin/AdminProducts'
import EditProduct from './components/admin/EditProduct'
import AdminBlog from './components/admin/AdminBlog'
import AddBlogs from './components/admin/AddBlogs'
import CategoryManagement from './components/admin/CategoryManagement'

import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoues'   // ⭐ <-- BURADA IMPORT ET

import ProductDetail from './components/ProductDetail'
import Profile from './components/Profile'
import SebetCart from './components/ShoppingCard'
import FavoriteButton from './components/Favorites'
import UpdateName from './components/Uptade'
import EcommerceApp from './components/Filter'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="light"
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path='/favourites' element={<PrivateRoute><FavoriteButton /></PrivateRoute>} />
          <Route path='/update' element={<PrivateRoute><UpdateName /></PrivateRoute>} />
          <Route path='/filter' element={<EcommerceApp />} />
          <Route path='/shoppingcard' element={<PrivateRoute><SebetCart /></PrivateRoute>} />

          {/* ====================== ADMIN ROUTES ====================== */}
          <Route path='/admin/add-products' element={
            <AdminRoute>
              <AddProducts />
            </AdminRoute>
          } />

          <Route path='/admin/adminproducts' element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />


                    <Route path='/admin/admin-dashboard' element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          <Route path='/admin/edit-product/:id' element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          } />

          <Route path='/admin/admin-blogs' element={
            <AdminRoute>
              <AdminBlog />
            </AdminRoute>
          } />

          <Route path='/admin/add-blog' element={
            <AdminRoute>
              <AddBlogs />
            </AdminRoute>
          } />

          <Route path='/admin/categories' element={
            <AdminRoute>
              <CategoryManagement />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
