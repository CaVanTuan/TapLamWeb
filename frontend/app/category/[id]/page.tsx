"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getByCategoryId } from "@/services/product-services";
import NavBar from "@/components/NavBar";
import { createCart } from "@/services/cart-services";
import Link from "next/link";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = Number(params.id);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getByCategoryId(categoryId);
        setProducts(data);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm theo danh mục:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      await createCart({ productId, quantity: 1 });
      window.dispatchEvent(new CustomEvent("cartChanged", { detail: { added: 1 } }));
      alert("Đã thêm sản phẩm vào giỏ hàng 🛒");
    } catch (err) {
      console.error(err);
      alert("Thêm vào giỏ hàng thất bại 😢");
    }
  };

  if (loading) return <p className="mt-32 text-center">Đang tải sản phẩm...</p>;
  if (!products || products.length === 0) return <p className="mt-32 text-center">Không có sản phẩm nào 😢</p>;

  return (
    <>
      <NavBar />
      <section className="max-w-7xl mx-auto px-4 py-32">
        <h2 className="text-3xl font-bold mb-8">Sản phẩm trong danh mục</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-1">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                </p>
              </Link>

              <button
                onClick={() => handleAddToCart(product.id)}
                className="mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                disabled={product.instock === 0}
              >
                {product.instock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng 🛒"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
