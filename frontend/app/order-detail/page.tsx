"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import { getForUser } from "@/services/orderdetail-services";

interface OrderDetailItem {
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}

interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
}

export default function OrderDetailPage() {
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get("orderId"));

  const [details, setDetails] = useState<OrderDetailItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
        try {
        const data = await getForUser(orderId);

        if (data) {
        setShippingInfo({
            fullName: data.fullName,
            phone: data.phone,
            address: data.address,
            note: data.note,
        });

        setDetails(data.orderDetails);
        }

        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    fetchDetails();
    }, [orderId]);

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!details || details.length === 0)
    return <p className="text-center mt-10">Không tìm thấy chi tiết đơn hàng 😢</p>;

  const total = details.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <>
      <NavBar />

      <section className="max-w-4xl mx-auto pt-32 px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Chi tiết đơn hàng #{orderId}
        </h2>

        {/* Thông tin giao hàng */}
        {shippingInfo && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold mb-4">Thông tin giao hàng</h3>
            <p><strong>Người nhận:</strong> {shippingInfo.fullName}</p>
            <p><strong>Số điện thoại:</strong> {shippingInfo.phone}</p>
            <p><strong>Địa chỉ:</strong> {shippingInfo.address}</p>
            {shippingInfo.note && <p><strong>Ghi chú:</strong> {shippingInfo.note}</p>}
          </div>
        )}

        {/* Danh sách sản phẩm */}
        <div className="flex flex-col gap-4 mb-8">
          {details.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.productName}</h3>
                <p className="text-gray-500">Số lượng: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.unitPrice)}
                </p>
                <p className="text-gray-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng tiền */}
        <div className="bg-white p-6 rounded-lg shadow text-xl font-semibold flex justify-between">
          <span>Tổng cộng:</span>
          <span>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(total)}
          </span>
        </div>
      </section>
    </>
  );
}
