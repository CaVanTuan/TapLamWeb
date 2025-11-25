"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/services/user-services";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const data = await getMe();
      setUser(data);
    } catch (err) {
      console.error("Lỗi lấy thông tin người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <NavBar />

      <section className="max-w-5xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Thông tin tài khoản
        </h2>

        {loading ? (
          <p className="text-center text-lg text-gray-500">Đang tải...</p>
        ) : !user ? (
          <p className="text-center text-lg text-red-500">
            Không tìm thấy thông tin người dùng.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thông tin cơ bản */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4">
              <h3 className="text-xl font-semibold border-b pb-2 mb-4">Thông tin cơ bản</h3>
              <p>🆔 <strong>ID:</strong> {user.id}</p>
              <p>👤 <strong>Username:</strong> {user.username}</p>
              <p>📝 <strong>Họ và tên:</strong> {user.fullName}</p>
              <p>📧 <strong>Email:</strong> {user.email}</p>
              <p>📞 <strong>Số điện thoại:</strong> {user.phone}</p>
              <p>👑 <strong>Loại tài khoản:</strong> {user.role}</p>
              <p>📅 <strong>Ngày tạo:</strong>{" "}
                {new Date(user.createAt).toLocaleString("vi-VN")}
              </p>
              <p>⚡ <strong>Trạng thái:</strong>{" "}
                {user.isActive ? (
                  <span className="text-green-600 font-semibold">Đang hoạt động</span>
                ) : (
                  <span className="text-red-600 font-semibold">Ngưng hoạt động</span>
                )}
              </p>
            </div>

            {/* Thao tác */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 md:col-span-2">
              <h3 className="text-xl font-semibold border-b pb-2 mb-4">Hành động</h3>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => router.push("/account/edit")}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  ✏️ Sửa thông tin
                </button>

                <button
                  onClick={() => router.push("/account/change-password")}
                  className="w-full bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
                >
                  🔑 Đổi mật khẩu
                </button>

                <button
                  onClick={() => router.push("/order")}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
                >
                  📦 Xem đơn hàng
                </button>
              </div>

              <p className="text-gray-500 mt-4">
                💡 Lưu ý: Giữ thông tin cá nhân chính xác để quá trình giao dịch diễn ra thuận lợi.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
