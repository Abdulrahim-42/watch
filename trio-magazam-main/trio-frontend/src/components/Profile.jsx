// src/pages/Profile.js
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Mail, Edit, Save, X, Package, Heart, ShoppingCart } from "lucide-react";
import { useUpdateProfileMutation } from "../redux/api/authApi";
import { toast } from "react-hot-toast";

export default function Profile() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // RTK Query mutation for updating profile
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      // Artıq user birbaşa obyekt kimi gəlir: { name, email, ... }
      setName(user?.name || "");
      setEmail(user?.email || "");
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: "error", text: "Ad boş ola bilməz" });
      return;
    }

    setMessage({ type: "", text: "" });

    try {
      // Backend-ə yalnız name göndəririk
      await updateProfile({ name }).unwrap();

      // userSlice artıq authApi.onQueryStarted içində yenilənir
      toast.success("Adınız uğurla dəyişdirildi!");
      setMessage({ type: "success", text: "Profil uğurla yeniləndi" });
      setIsEditing(false);

      // 3 saniyədən sonra mesajı sil
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Xəta baş verdi!");
      setMessage({ type: "error", text: "Yeniləmə uğursuz oldu" });
    }
  };

  const handleCancel = () => {
    // Formu redux-dakı user dəyərlərinə qaytarırıq
    setName(user?.name || "");
    setEmail(user?.email || "");
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profilim</h1>
          <p className="text-gray-600 mt-2">Şəxsi məlumatlarınızı idarə edin</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-[#5C4977] to-[#7B6799] px-6 py-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-white/80">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-6">
                {message.text && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      Ad Soyad
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className={`flex-1 px-4 py-3 border rounded-xl transition-all ${
                          isEditing
                            ? "border-[#5C4977] bg-white focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-3 bg-[#5C4977] text-white rounded-xl hover:bg-[#5C4977]/90 transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Düzəliş
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {isLoading ? "Yenilənir..." : "Yadda saxla"}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Ləğv et
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Field (Read-only) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Email ünvanınızı dəyişmək üçün dəstək komandamızla əlaqə saxlayın.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sürətli Girişlər</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full flex items-center gap-3 p-4 text-left rounded-xl border border-gray-200 hover:border-[#5C4977] hover:bg-[#f5f2fa] transition-all group"
                >
                  <Package className="w-5 h-5 text-gray-400 group-hover:text-[#5C4977]" />
                  <div>
                    <div className="font-medium text-gray-900">Sifarişlərim</div>
                    <div className="text-sm text-gray-500">Sifariş tarixçəniz</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/wishlist")}
                  className="w-full flex items-center gap-3 p-4 text-left rounded-xl border border-gray-200 hover:border-[#5C4977] hover:bg-[#f5f2fa] transition-all group"
                >
                  <Heart className="w-5 h-5 text-gray-400 group-hover:text-[#5C4977]" />
                  <div>
                    <div className="font-medium text-gray-900">Seçilmişlər</div>
                    <div className="text-sm text-gray-500">Bəyəndiyiniz məhsullar</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="w-full flex items-center gap-3 p-4 text-left rounded-xl border border-gray-200 hover:border-[#5C4977] hover:bg-[#f5f2fa] transition-all group"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-[#5C4977]" />
                  <div>
                    <div className="font-medium text-gray-900">Səbət</div>
                    <div className="text-sm text-gray-500">Alış-veriş səbətiniz</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesab Məlumatları</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Hesab statusu:</span>
                  <span className="font-medium text-green-600">Aktiv</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Qeydiyyat tarixi:</span>
                  <span className="font-medium text-gray-900">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Son giriş:</span>
                  <span className="font-medium text-gray-900">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
