"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getByCategoryId } from "@/services/product-services";
import { motion } from "framer-motion";
import { createCart } from "@/services/cart-services";

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const data = await getByCategoryId(categoryId);
        const filtered = data.filter((p: any) => p.id !== currentProductId);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm liên quan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [categoryId, currentProductId]);

  if (loading) return <p className="mt-6 text-center">Đang tải sản phẩm liên quan...</p>;
  if (relatedProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            whileHover={{ scale: 1.05 }}
          >
            <Link href={`/products/${product.id}`}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mt-1">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </p>
            </Link>

            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                  alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
                  return;
                }
                try {
                  await createCart({ productId: product.id, quantity: 1 });
                  window.dispatchEvent(
                    new CustomEvent("cartChanged", { detail: { added: 1 } })
                  );
                  alert("Đã thêm sản phẩm vào giỏ hàng 🛒");
                } catch (err) {
                  console.error(err);
                  alert("Thêm vào giỏ hàng thất bại 😢");
                }
              }}
              className="mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Thêm vào giỏ hàng
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
