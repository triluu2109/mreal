"use client";

import Link from "next/link";
import { Building, Calendar, FileText, Home, KeyRound, LayoutDashboard, LogOut, Mail, MessageSquare, Users } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Lịch hẹn", icon: Calendar },
  { href: "/admin/chatbot-leads", label: "Chat Leads", icon: MessageSquare },
  { href: "/admin/sell", label: "Giỏ hàng bán", icon: Building },
  { href: "/admin/rent", label: "Giỏ hàng thuê", icon: KeyRound },
  { href: "/admin/staff", label: "Nhân sự", icon: Users },
  { href: "/admin/news", label: "Bài viết", icon: FileText },
  { href: "/admin/contacts", label: "Liên hệ", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-bg flex">
      <aside className="w-64 bg-navy min-h-screen flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center font-bold text-white text-sm font-heading">
              M
            </div>
            <div>
              <div className="font-heading font-bold text-white text-sm">M-Real Estate</div>
              <div className="text-white/40 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm">
            <Home size={18} />
            Xem trang chủ
          </Link>
          <button
            onClick={() => {
              window.location.href = "/api/admin-logout";
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-white/5 transition-all text-sm w-full"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex-1 min-h-screen flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-border px-8 py-4 flex items-center justify-between shrink-0">
          <div className="text-gray-text text-sm">
            Xin chào, <span className="font-semibold text-navy">Admin</span>
          </div>
          <div className="text-gray-muted text-xs">
            {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
