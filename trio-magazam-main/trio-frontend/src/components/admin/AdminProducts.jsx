import React from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteProductMutation, useGetProductsQuery } from "../../redux/api/productsApi"; // Redux Toolkit sorğusu
import ChartComponent from "./ChartComponent";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";

import Swal from "sweetalert2"



const AdminProducts = () => {
    // Redux sorğusu ilə məhsulları əldə etmək
    const { data, error, isLoading, refetch } = useGetProductsQuery();
    const [deleteProduct] = useDeleteProductMutation()

    // Fake Chart məlumatı
    const products = data?.products?.map((product) => product.name) || [];
    //0-1 0.45435 0.325325
    const sales = data?.products?.map(() => Math.round(Math.random() * 200) + 50) || [];


    const navigate = useNavigate()
    //skeleton loading ui
    if (isLoading) {
        return <div className="text-center text-xl mt-10">Yüklənir...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 text-xl mt-10">Xəta baş verdi: {error.message}</div>;
    }


    const handleEdit = (id) => {
        navigate(`/admin/edit-product/${id}`);
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
        });


        if (result.isConfirmed) {
            try {
                await deleteProduct(id); // Delete məhsul
                // `refetch` funksiyasını istifadə edərək məhsul siyahısını yeniləyirik
                // window.reload
                await refetch(); // Query-yə təkrar sorğu göndəririk
                Swal.fire("Silindi!", "Məhsul uğurla silindi.", "success");
            } catch (error) {
                console.log(error)
                console.error("Məhsul silinərkən xəta baş verdi:", error);
                Swal.fire("Xəta!", "Məhsul silinirken xəta baş verdi.", "error");
            }
        }

        else {
            Swal.fire("Ləğv edildi", "Məhsul silinmədi", "info");
        }
    }



    return (
        <div className="flex justify-around items-start flex-wrap gap-10 mt-32">
            {/* Chart Komponenti */}
            <ChartComponent
                title="Admin Panel Statistika"
                labels={products}
                dataPoints={sales}
            />

            {/* Məhsul Siyahısı */}
            <div className="">
                <h2 className="text-2xl font-bold mb-5">Məhsullar Siyahısı</h2>
                <table className="table-auto w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Ad</th>
                            <th className="border px-4 py-2">Qiymət</th>
                            <th className="border px-4 py-2">Kateqoriya</th>
                            <th className="border px-4 py-2">Əməliyyatlar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map((product) => (
                            // Each child should have unique key
                            <tr key={product._id}>
                                <td className="border px-4 py-2">{product.name}</td>
                                <td className="border px-4 py-2">{product.price} AZN</td>
                                <td className="border px-4 py-2">{product.category}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                        onClick={() => handleEdit(product._id)}
                                    >
                                        <FaRegEdit />

                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    >
                                        <MdDeleteSweep />

                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;