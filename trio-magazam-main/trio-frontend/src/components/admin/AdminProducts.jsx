import React from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteProductMutation, useGetProductsQuery } from "../../redux/api/productsApi";
import ChartComponent from "./ChartComponent";
import { FaRegEdit, FaPlus, FaChartLine, FaBoxOpen } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { FiTrendingUp } from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";
import Swal from "sweetalert2";

const AdminProducts = () => {
    const { data, error, isLoading, refetch } = useGetProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/admin/edit-product/${id}`);
    };

    const handleCreate = () => {
        navigate("/admin/create-product");
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Məhsulu silmək istədiyinizdən əminsinizmi?",
            text: "Bu əməliyyat geri qaytarıla bilməz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Xeyr, ləğv et",
            reverseButtons: true,
            confirmButtonColor: "#5C4977",
            cancelButtonColor: "#6B7280",
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(id);
                await refetch();
                Swal.fire({
                    title: "Silindi!",
                    text: "Məhsul uğurla silindi.",
                    icon: "success",
                    confirmButtonColor: "#5C4977",
                });
            } catch (error) {
                console.error("Məhsul silinərkən xəta baş verdi:", error);
                Swal.fire({
                    title: "Xəta!",
                    text: "Məhsul silinirken xəta baş verdi.",
                    icon: "error",
                    confirmButtonColor: "#DC2626",
                });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] pt-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] pt-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                        <p className="font-medium">Xəta baş verdi:</p>
                        <p>{error.message}</p>
                        <button
                            onClick={refetch}
                            className="mt-3 bg-[#5C4977] text-white px-4 py-2 rounded-lg hover:bg-[#5C4977]/90 transition-colors"
                        >
                            Yenidən yoxla
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] pt-24 px-4 pb-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Admin Panel</h1>
                            <p className="text-gray-600">Məhsulların idarə edilməsi</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="bg-[#5C4977] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-[#5C4977]/20"
                        >
                            <FaPlus className="h-5 w-5" />
                            Yeni Məhsul
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#5C4977]">Məhsullar Siyahısı</h2>
                        <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                            {data?.products?.length || 0} məhsul
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#5C4977]/10">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Ad</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Qiymət</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Kateqoriya</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.products?.map((product) => (
                                    <tr 
                                        key={product._id} 
                                        className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/2 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-gray-800">{product.name}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-bold text-[#5C4977]">{product.price} AZN</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(product._id)}
                                                    className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors"
                                                    title="Redaktə et"
                                                >
                                                    <FaRegEdit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <MdDeleteSweep className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {(!data?.products || data.products.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                            Heç bir məhsul tapılmadı
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        © 2024 META SHOP Admin Panel. Bütün hüquqlar qorunur.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;