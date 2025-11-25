"use client";

import { useState, useEffect } from "react";
import { getMe, updatePassword } from "@/services/user-services";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle password visibility
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUserId(data.id);
      } catch (err) {
        console.error("Lỗi lấy user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChangePassword = async () => {
    if (!userId) return alert("Không tìm thấy user!");

    if (!oldPassword || !newPassword)
      return alert("Vui lòng nhập đầy đủ!");

    if (newPassword !== confirmPassword)
      return alert("Mật khẩu mới không khớp!");

    try {
      await updatePassword(userId, oldPassword, newPassword);
      alert("Đổi mật khẩu thành công!");
      router.push("/account");
    } catch (err: any) {
      console.error("Lỗi đổi mật khẩu:", err);
      alert("Đổi mật khẩu thất bại! Hãy kiểm tra lại mật khẩu cũ.");
    }
  };

  const EyeIcon = ({ show }: { show: boolean }) => (
    <span className="cursor-pointer select-none text-sm px-2">
      {show ? "🙈" : "👁️"}
    </span>
  );

  return (
    <>
      <NavBar />

      <section className="max-w-3xl mx-auto px-4 py-32">
        <h2 className="text-3xl font-bold mb-8">Đổi mật khẩu</h2>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="bg-white shadow p-6 rounded-lg max-w-xl">
            <div className="flex flex-col gap-4">
              
              {/* Old Password */}
              <div>
                <label className="block mb-1 font-medium">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    className="border rounded px-3 py-2 w-full pr-10"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-2 top-2"
                  >
                    <EyeIcon show={showOld} />
                  </span>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block mb-1 font-medium">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    className="border rounded px-3 py-2 w-full pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2 top-2"
                  >
                    <EyeIcon show={showNew} />
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 font-medium">Nhập lại mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="border rounded px-3 py-2 w-full pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-2"
                  >
                    <EyeIcon show={showConfirm} />
                  </span>
                </div>
              </div>

            </div>

            <div className="mt-8 flex gap-4 justify-end">
              <button
                className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => router.push("/account")}
              >
                Quay lại
              </button>

              <button
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleChangePassword}
              >
                Lưu mật khẩu mới
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}