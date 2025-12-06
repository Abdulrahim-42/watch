import React, { useState } from "react";
import { useGetSpecsQuery, useCreateSpecMutation, useDeleteSpecMutation } from "../../redux/api/specApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SpecsManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetSpecsQuery();
  const [createSpec, { isLoading: isCreating }] = useCreateSpecMutation();
  const [deleteSpec] = useDeleteSpecMutation();

  const [showAddSpecModal, setShowAddSpecModal] = useState(false);
  const [specForm, setSpecForm] = useState({
    name: "",
  });

  const specs = data?.specs || [];

  const handleSpecInputChange = (e) => {
    const { name, value } = e.target;
    setSpecForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecSubmit = async (e) => {
    e.preventDefault();

    if (!specForm.name.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Xüsusiyyət adı tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      await createSpec({ name: specForm.name.trim() }).unwrap();

      Swal.fire({
        title: "Uğur!",
        text: "Xüsusiyyət uğurla əlavə edildi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      });

      setSpecForm({ name: "" });
      setShowAddSpecModal(false);
      refetch();
    } catch (error) {
      console.error("Xəta:", error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Xüsusiyyət əlavə edilərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  const handleDeleteSpec = async (specId) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu xüsusiyyəti silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deleteSpec(specId).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Xüsusiyyət uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Xüsusiyyət silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] pt-24 px-4 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Xüsusiyyətlər İdarəetməsi</h1>
              <p className="text-gray-600">Xüsusiyyətləri idarə edin</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/admin/admin-dashboard")}
                className="text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors border border-[#5C4977] hover:bg-[#5C4977]/5 px-4 py-2 rounded-xl"
              >
                Geri qayıt
              </button>
              <button
                onClick={() => setShowAddSpecModal(true)}
                className="bg-[#5C4977] text-white hover:bg-[#5C4977]/90 font-medium transition-colors px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <FaPlus className="h-4 w-4" />
                Yeni Xüsusiyyət
              </button>
            </div>
          </div>
        </div>

        {/* Specs List */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 md:p-8">
          {specs.length === 0 ? (
            <div className="text-center py-12">
              <FaTimes className="h-16 w-16 text-[#5C4977]/30 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Heç bir xüsusiyyət yoxdur</p>
              <p className="text-gray-500 text-sm mt-2">İlk xüsusiyyəti əlavə edin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specs.map((spec) => (
                <div
                  key={spec._id}
                  className="border border-[#5C4977]/20 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center justify-between"
                >
                  <span className="text-[#5C4977] font-medium text-lg">{spec.name}</span>
                  <button
                    onClick={() => handleDeleteSpec(spec._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Sil"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Spec Modal */}
        {showAddSpecModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#5C4977]">Yeni Xüsusiyyət</h2>
                <button
                  onClick={() => {
                    setShowAddSpecModal(false);
                    setSpecForm({ name: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSpecSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Xüsusiyyət adı
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={specForm.name}
                    onChange={handleSpecInputChange}
                    placeholder="Xüsusiyyət adını daxil edin"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSpecModal(false);
                      setSpecForm({ name: "" });
                    }}
                    className="flex-1 border border-[#5C4977]/20 text-[#5C4977] hover:bg-[#5C4977]/5 font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 bg-[#5C4977] text-white hover:bg-[#5C4977]/90 font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "Yadda saxlanır..." : "Yadda saxla"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecsManagement;

