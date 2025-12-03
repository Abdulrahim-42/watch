import React, { useState, useEffect } from "react";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
} from "../redux/api/productsApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const SebetCart = ({ isOpen, onClose }) => {
  const { data: cartData, isLoading, error } = useGetCartQuery();
  const navigate = useNavigate();

  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateQuantity] = useUpdateCartQuantityMutation();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Calculate subtotal
  const calculateTotal = () => {
    if (!cartData?.cart) return 0;
    
    return cartData.cart.reduce((total, item) => {
      if (!item?.product) {
        return total;
      }
      const price = item.product.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const subtotal = calculateTotal();
  const freeShippingThreshold = 3470; // 3.470,00 ₼
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleQuantityChange = async (productId, currentQuantity, stock, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      toast.error("Məhsul sayı 1-dən az ola bilməz");
      return;
    }

    if (newQuantity > stock) {
      toast.error("Kifayət qədər stok yoxdur");
      return;
    }

    try {
      await updateQuantity({ productId, quantity: newQuantity }).unwrap();
      toast.success("Məhsul sayı yeniləndi");
    } catch (error) {
      toast.error("Miqdar yenilənərkən xəta baş verdi");
    }
  };

  const handleRemoveFromCart = async (productId, e) => {
    e.stopPropagation();
    try {
      await removeFromCart(productId).unwrap();
      toast.success("Məhsul səbətdən silindi");
    } catch (error) {
      toast.error("Məhsul silinərkən xəta baş verdi");
    }
  };

  const handleViewCart = () => {
    onClose();
    navigate("/shoppingcard");
  };

  const handleCheckout = () => {
    onClose();
    navigate("/shoppingcard");
  };

  const handleReturnToShop = () => {
    onClose();
    navigate("/");
  };

  // Filter valid cart items
  const validCartItems = cartData?.cart?.filter(item => item?.product) || [];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Cart Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Shopping cart</h2>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="text-sm">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
            </div>
          ) : error || !validCartItems.length ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="mb-8">
                <svg
                  className="w-40 h-40 text-gray-300 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 6L18 18M18 6L6 18"
                  />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-900 mb-8 text-center">
                No products in the cart.
              </p>
              <button
                onClick={handleReturnToShop}
                className="px-8 py-3 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-colors font-medium"
              >
                Return To Shop
              </button>
            </div>
          ) : (
            /* Cart with Items */
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {validCartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      <Link
                        to={`/product/${item.product._id}`}
                        onClick={onClose}
                        className="block w-full h-full"
                      >
                        <img
                          src={
                            item.product.images && item.product.images.length > 0
                              ? item.product.images[0]?.url
                              : "/placeholder.svg"
                          }
                          alt={item.product.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product._id}`}
                            onClick={onClose}
                            className="block"
                          >
                            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.product.sku && (
                            <p className="text-xs text-gray-500">
                              SKU: {item.product.sku}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleRemoveFromCart(item.product._id, e)}
                          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity,
                                item.product.stock,
                                -1
                              )
                            }
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-600 font-medium"
                          >
                            -
                          </button>
                          <span className="px-4 py-1.5 text-sm font-medium min-w-[3rem] text-center border-x border-gray-300 bg-gray-50">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity,
                                item.product.stock,
                                1
                              )
                            }
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-600 font-medium"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-semibold text-gray-900 text-sm">
                          {item.quantity} × {(item.product.price || 0).toFixed(2)} ₼
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-medium">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    {subtotal.toFixed(2)} ₼
                  </span>
                </div>

                {/* Free Shipping Message */}
                {remainingForFreeShipping > 0 ? (
                  <p className="text-sm text-gray-600 mb-6">
                    Add {remainingForFreeShipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₼ to cart and get free shipping!
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mb-6 font-medium">
                    ✓ You qualify for free shipping!
                  </p>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleViewCart}
                    className="w-full px-6 py-3 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-colors font-medium"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="w-full px-6 py-3 bg-[#4a3a63] text-white rounded-lg hover:bg-[#4a3a63]/90 transition-colors font-medium"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SebetCart;
