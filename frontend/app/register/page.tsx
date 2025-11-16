"use client";

import { useState } from "react";
import { createUser } from "@/services/user-services";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // CHECK PASSWORD MATCH
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không trùng khớp!");
      setLoading(false);
      return;
    }

    try {
      await createUser({
        username: form.username,
        password: form.password,
        email: form.email,
        fullName: form.fullName,
        phone: form.phone,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 border border-white/40">

        <div className="flex flex-col items-center mb-8 gap-3">
          <img
            src="/image/NovaLogo.png"
            alt="Logo"
            className="h-14 w-14 rounded-full object-cover shadow-md"
          />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-wide">
            Tạo tài khoản mới
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FULL NAME */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Full Name</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all"
              name="fullName"
              placeholder="Nhập họ và tên..."
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
              name="email"
              placeholder="Nhập email..."
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Phone</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all"
              name="phone"
              placeholder="Nhập số điện thoại..."
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* USERNAME */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Username</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all"
              name="username"
              placeholder="Nhập username..."
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                name="password"
                placeholder="Nhập mật khẩu..."
                value={form.password}
                onChange={handleChange}
              />
              <span
                className="absolute right-4 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu..."
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <span
                className="absolute right-4 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* ERROR */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl shadow-lg hover:opacity-90 transition text-lg font-semibold"
          >
            {loading ? "Creating..." : "Đăng ký tài khoản"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Đã có tài khoản?{" "}
          <span
            className="text-purple-600 font-medium cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}