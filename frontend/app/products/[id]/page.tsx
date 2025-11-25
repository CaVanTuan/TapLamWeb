"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getById } from "@/services/product-services";
import { createCart } from "@/services/cart-services";
import NavBar from "@/components/NavBar";
import RelatedProducts from "@/components/RelatedProducts";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      await createCart({ productId: product.id, quantity });
      window.dispatchEvent(
        new CustomEvent("cartChanged", { detail: { added: quantity } })
      );
      alert("Đã thêm vào giỏ hàng 🛒");
    } catch (err) {
      console.error(err);
      alert("Thêm vào giỏ hàng thất bại 😢");
    }
  };

  if (loading)
    return <p className="mt-32 text-center">Đang tải sản phẩm...</p>;
  if (!product)
    return <p className="mt-32 text-center">Không tìm thấy sản phẩm 😢</p>;

  return (
    <>
      <NavBar />

      <section className="max-w-6xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-w-md rounded-xl shadow-lg object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold tracking-wide">{product.name}</h1>

          {/* Price */}
          <p className="text-3xl text-red-500 font-semibold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </p>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-lg">
            {product.description || "Không có mô tả."}
          </p>

          {/* Category */}
          <p className="text-gray-800 text-lg">
            <strong className="font-semibold">Danh mục:</strong>{" "}
            {product.category?.name || "Không xác định"}
          </p>

          {/* Stock */}
          <p className="text-gray-800 text-lg">
            <strong className="font-semibold">Tồn kho:</strong> {product.instock}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-lg font-medium">Số lượng:</span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-6 py-2">{quantity}</span>
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-black text-white py-3 rounded-full text-lg font-medium shadow-md hover:bg-gray-900 transition disabled:bg-gray-400"
            disabled={product.instock === 0}
          >
            {product.instock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng 🛒"}
          </button>
        </div>
      </section>

      {/* Related Products */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <RelatedProducts
          categoryId={product.categoryId}
          currentProductId={product.id}
        />
      </div>
    </>
  );
}
