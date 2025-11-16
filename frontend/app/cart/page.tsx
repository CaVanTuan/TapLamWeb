"use client";

import { useEffect, useState } from "react";
import { getCart, updateQuantity, deleteCart } from "@/services/cart-services";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar"; // import NavBar vào đây

interface CartItem {
  cartItemId: number;
  productId: number;
  quantity: number;
  product: {
    name: string;
    imageUrl: string;
    price: number;
  } | null;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const data = await getCart();
      setCartItems(data);
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    try {
      await updateQuantity({ productId: item.productId, quantity: newQuantity });
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.productId === item.productId ? { ...ci, quantity: newQuantity } : ci
        )
      );
      window.dispatchEvent(new CustomEvent("cartChanged", { detail: { added: delta } }));
    } catch (err) {
      console.error("Cập nhật số lượng thất bại:", err);
    }
  };

  const handleDelete = async (item: CartItem) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;

    try {
      await deleteCart(item.productId);
      setCartItems((prev) => prev.filter((ci) => ci.productId !== item.productId));
      window.dispatchEvent(new CustomEvent("cartChanged", { detail: { added: -item.quantity } }));
    } catch (err) {
      console.error("Xóa sản phẩm thất bại:", err);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <>
      {/* Navbar */}
      <NavBar />

      {/* Cart Content */}
      <section className="max-w-7xl mx-auto px-4 py-32"> {/* py-32 để không bị navbar fixed che nội dung */}
        <h2 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h2>

        {loading ? (
          <p className="text-center mt-10">Đang tải giỏ hàng...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-center mt-10">Giỏ hàng trống 😢</p>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
                >
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product?.name}</h3>
                    <p className="text-gray-600">
                      {item.product
                        ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.product.price)
                        : "N/A"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end items-center gap-6">
              <span className="text-xl font-semibold">
                Tổng:{" "}
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}
              </span>
              <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                Thanh toán
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
