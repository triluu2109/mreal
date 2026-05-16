"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  Building,
  Calendar,
  FileText,
  Home,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  UserCircle,
  Users,
} from "lucide-react";
import { logoutAdmin } from "./login/actions";
import { hasPermission, type AdminPermission, type AdminRoleValue } from "@/lib/admin/permissions";
import { siteImages } from "@/config/images";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Lịch hẹn", icon: Calendar, permission: "appointments.manage" },
  { href: "/admin/chatbot-leads", label: "Chat Leads", icon: MessageSquare, permission: "leads.manage" },
  { href: "/admin/sell", label: "Giỏ hàng bán", icon: Building, permission: "listings.read" },
  { href: "/admin/rent", label: "Giỏ hàng thuê", icon: KeyRound, permission: "listings.read" },
  { href: "/admin/staff", label: "Nhân sự", icon: Users, masterOnly: true },
  { href: "/admin/news", label: "Bài viết", icon: FileText, permission: "news.manage" },
  { href: "/admin/contacts", label: "Liên hệ", icon: Mail, permission: "contacts.manage" },
  { href: "/admin/account", label: "Tài khoản", icon: UserCircle },
] satisfies Array<{
  href: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  permission?: AdminPermission;
  masterOnly?: boolean;
}>;

type AdminMe = {
  fullName: string;
  role: AdminRoleValue;
  permissions: string[];
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminMe | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    let active = true;
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active) setAdmin(data);
      })
      .catch(() => {
        if (active) setAdmin(null);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-bg flex">
      <aside className="w-64 bg-navy min-h-screen flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1.5">
              <Image
                src={siteImages.logo.square}
                alt="M-Real Estate"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="font-heading font-bold text-white text-sm">M-Real Estate</div>
              <div className="text-white/40 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.filter((item) => canShowNavItem(item, admin)).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm">
            <Home size={18} />
            Xem trang chủ
          </Link>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-white/5 transition-all text-sm w-full"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 min-h-screen flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-border px-8 py-4 flex items-center justify-between shrink-0">
          <div className="text-gray-text text-sm">
            Xin chào, <span className="font-semibold text-navy">{admin?.fullName ?? "Admin"}</span>
          </div>
          <div className="text-gray-muted text-xs">Admin workspace</div>
        </header>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function canShowNavItem(item: (typeof navItems)[number], admin: AdminMe | null) {
  if (!item.permission && !item.masterOnly) return true;
  if (!admin) return false;
  if (item.masterOnly) return admin.role === "master";
  return item.permission ? hasPermission(admin.role, admin.permissions, item.permission) : true;
}
