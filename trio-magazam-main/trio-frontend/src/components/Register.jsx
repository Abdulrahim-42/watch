import React, { useState } from 'react';
import { useRegisterMutation } from '../redux/api/authApi';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, UserPlus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser, setIsAuthenticated } from '../redux/features/userSlice';

const RegisterForm = () => {
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Ad tələb olunur';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email tələb olunur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email düzgün deyil';
    }

    if (!formData.password) {
      errors.password = 'Şifrə tələb olunur';
    } else if (formData.password.length < 6) {
      errors.password = 'Şifrə ən azı 6 simvol olmalıdır';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Zəhmət olmasa şifrənizi təsdiqləyin';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Şifrələr uyğun gəlmir';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const result = await register(registerData).unwrap();
      
      console.log('Qeydiyyat uğurla tamamlandı!', result);
      
      // User məlumatlarını Redux store və localStorage-a yaz
      dispatch(setUser({
        name: formData.name,
        email: formData.email,
        id: result.user?.id,
        token: result.token
      }));
      dispatch(setIsAuthenticated(true));
      
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
      });
      
      navigate('/');
      
    } catch (err) {
      console.error('Qeydiyyat uğursuz oldu:', err);
    }
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/images/logo.svg" 
              alt="META SHOP Logo" 
              className="h-16 cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
          <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Hesab Yarat</h1>
          <p className="text-gray-600">Yeni hesabınızı yaradın</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error.data?.message || 'Qeydiyyat uğursuz oldu. Zəhmət olmasa yenidən cəhd edin.'}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#5C4977] mb-2">
                Ad Soyad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#5C4977]/60" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                    formErrors.name 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                  }`}
                  placeholder="Adınızı və soyadınızı daxil edin"
                  disabled={isLoading}
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5C4977] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#5C4977]/60" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                    formErrors.email 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                  }`}
                  placeholder="email@example.com"
                  disabled={isLoading}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#5C4977] mb-2">
                Şifrə
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#5C4977]/60" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                    formErrors.password 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                  }`}
                  placeholder="Şifrənizi daxil edin"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#5C4977]/60 hover:text-[#5C4977]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#5C4977]/60 hover:text-[#5C4977]" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5C4977] mb-2">
                Şifrəni Təsdiqlə
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#5C4977]/60" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                    formErrors.confirmPassword 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                  }`}
                  placeholder="Şifrənizi təkrar daxil edin"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-[#5C4977]/60 hover:text-[#5C4977]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#5C4977]/60 hover:text-[#5C4977]" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 text-[#5C4977] border-[#5C4977]/30 rounded focus:ring-[#5C4977]"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Məni xatırla
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5C4977] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Qeydiyyat olunur...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Hesab Yarat
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Və ya</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 px-4 rounded-xl font-medium border border-gray-300 hover:border-[#5C4977]/40 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ilə qeydiyyat
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Artıq hesabınız var?{' '}
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className="text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors"
                >
                  Daxil olun
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 META SHOP. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;