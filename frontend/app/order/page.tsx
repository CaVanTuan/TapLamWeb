"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { getMe } from "@/services/order-services";

export default function OrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMe();
        setOrders(data);
      } catch (err) {
        console.error("Lỗi lấy danh sách đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Đang tải danh sách đơn hàng...</p>;
  if (!orders || orders.length === 0)
    return <p className="text-center mt-10">Bạn chưa có đơn hàng nào 😢</p>;

  return (
    <>
      <NavBar />
      <section className="max-w-5xl mx-auto pt-32 px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Danh sách đơn hàng</h2>

        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const totalAmount = order.orderDetails.reduce(
              (sum: number, od: any) => sum + od.unitPrice * od.quantity,
              0
            );

            return (
              <Link
                key={order.orderId}
                href={`/order-detail?orderId=${order.orderId}`}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-semibold">Đơn hàng #{order.orderId}</p>
                  <p className="text-gray-500">
                    Ngày: {new Date(order.orderDate).toLocaleString("vi-VN")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalAmount)}
                  </p>

                  <p
                    className={`font-semibold ${
                      order.status === "Pending" ? "text-yellow-500" :
                      order.status === "Completed" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {order.status ?? "Pending"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
