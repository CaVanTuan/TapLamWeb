"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, LogOut, Settings, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/services/auth-services";
import { getCart } from "@/services/cart-services";

export default function NavBar() {
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateUser = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.username);
        } catch {
          setUserName(null);
        }
      } else setUserName(null);
    };
    window.addEventListener("userChanged", updateUser);
    updateUser();
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  // Load cart count from backend on mount
  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // chưa login
      try {
        const cartItems = await getCart();
        const count = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const updateCart = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.added) {
        setCartCount(prev => prev + customEvent.detail.added);
      }
    };
    window.addEventListener("cartChanged", updateCart);
    return () => window.removeEventListener("cartChanged", updateCart);
  }, []);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else router.push("/cart");
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/login");
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("product-search");
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const isHomePage = pathname === "/";
  const bgClass = isHomePage
    ? isScrolled
      ? "bg-white/90 text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] backdrop-blur-md"
      : "bg-transparent text-white"
    : "bg-white text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)]";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 font-['Poppins'] transition-all duration-500 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/image/NovaLogo.png"
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover shadow-sm"
          />
          <span className="text-2xl font-semibold tracking-wide">
            <span className="font-bold">Nova</span> Store
          </span>
        </Link>

        <div className="flex items-center gap-6 relative">
          <button className="hover:opacity-80 transition" onClick={handleSearchClick}>
            <Search size={22} />
          </button>

          <button
            onClick={handleCartClick}
            className="relative hover:opacity-80 transition"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {userName ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 hover:opacity-80 transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <User size={20} />
                <span className="text-sm font-medium">{userName}</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={16} /> Thông tin tài khoản
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <User size={20} />
              <span className="text-sm font-medium">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
