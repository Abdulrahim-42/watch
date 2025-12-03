import React, { useState } from "react";
import { useUpdateProfileMutation } from "../redux/api/authApi";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const UpdateName = () => {
  const { user } = useSelector((state) => state.user);
  
  const [name, setName] = useState(user?.name || "");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateProfile({ name }).unwrap();
      toast.success("Adınız uğurla dəyişdirildi!");
      console.log("Yenilənmiş user:", res.user);
    } catch (err) {
      toast.error("Xəta baş verdi!");
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow-lg border rounded-xl">
      <h1 className="text-2xl font-bold mb-5 text-center">
        Ad Yeniləmə (Profile Update)
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Yeni Adınız:</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            placeholder="Yeni ad daxil edin..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? "Yenilənir..." : "Adı Yenilə"}
        </button>
      </form>
    </div>
  );
};

export default UpdateName;
