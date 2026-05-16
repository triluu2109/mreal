import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { Building, Calendar, FileText, Mail, MessageSquare, TrendingUp, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Admin Dashboard | M-Real Estate" };
export const dynamic = "force-dynamic";

async function getStats() {
  const [
    appointments,
    leads,
    news,
    contacts,
    sell,
    rent,
    staff,
    newAppointments,
    newLeads,
    recentAppointments,
    recentLeads,
    sellVisible,
    rentVisible,
  ] = await Promise.all([
    safe(() => prisma.appointment.count({ where: { deletedAt: null } }), 0),
    safe(() => prisma.chatbotLead.count({ where: { deletedAt: null } }), 0),
    safe(() => prisma.newsPost.count({ where: { deletedAt: null } }), 0),
    safe(() => prisma.contact.count({ where: { deletedAt: null } }), 0),
    safe(() => prisma.saleListing.count({ where: { deletedAt: null } }), 0),
    safe(() => prisma.rentalListing.count({ where: { deletedAt: null } }), 0),
    safe(() => prisma.adminProfile.count({ where: { role: { not: "master" }, isActive: true, deletedAt: null } }), 0),
    safe(() => prisma.appointment.count({ where: { status: "new", deletedAt: null } }), 0),
    safe(() => prisma.chatbotLead.count({ where: { status: "new", deletedAt: null } }), 0),
    safe(() => prisma.appointment.findMany({
      take: 5,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, phone: true, status: true, createdAt: true },
    }), []),
    safe(() => prisma.chatbotLead.findMany({
      take: 5,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, phone: true, need: true, area: true, status: true, createdAt: true },
    }), []),
    safe(() => prisma.saleListing.count({ where: { isVisible: true, deletedAt: null } }), 0),
    safe(() => prisma.rentalListing.count({ where: { isVisible: true, deletedAt: null } }), 0),
  ]);

  return {
    appointments, leads, news, contacts, sell, rent, staff,
    newAppointments, newLeads, recentAppointments, recentLeads,
    sellVisible,
    rentVisible,
    sellHidden: sell - sellVisible,
    rentHidden: rent - rentVisible,
  };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getStats();

  const cards = [
    {
      icon: Building, label: "Giỏ hàng bán", value: stats.sell, new: null,
      href: "/admin/sell", color: "bg-navy",
      sub: `${stats.sellVisible} hiện - ${stats.sellHidden} ẩn`,
    },
    {
      icon: Building, label: "Giỏ hàng thuê", value: stats.rent, new: null,
      href: "/admin/rent", color: "bg-gold",
      sub: `${stats.rentVisible} hiện - ${stats.rentHidden} ẩn`,
    },
    { icon: Calendar, label: "Lịch hẹn", value: stats.appointments, new: stats.newAppointments, href: "/admin/appointments", color: "bg-navy-light", sub: null },
    { icon: MessageSquare, label: "Chat leads", value: stats.leads, new: stats.newLeads, href: "/admin/chatbot-leads", color: "bg-gold-dark", sub: null },
    { icon: FileText, label: "Bài viết", value: stats.news, new: null, href: "/admin/news", color: "bg-navy", sub: null },
    { icon: Mail, label: "Liên hệ", value: stats.contacts, new: null, href: "/admin/contacts", color: "bg-gold", sub: null },
    { icon: Users, label: "Nhân sự", value: stats.staff, new: null, href: "/admin/staff", color: "bg-gold-dark", sub: null },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-navy">Dashboard</h1>
        <p className="text-gray-text mt-1">Tổng quan hoạt động kinh doanh</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5 mb-10">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-lg p-6 border border-gray-border hover:border-gold/40 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon size={20} className="text-white" />
              </div>
              {card.new !== null && card.new > 0 && <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full">+{card.new} mới</span>}
            </div>
            <div className="font-heading font-extrabold text-3xl text-navy mb-1">{card.value}</div>
            <div className="text-gray-text text-sm group-hover:text-gold transition-colors">{card.label}</div>
            {card.sub && <div className="text-gray-muted text-xs mt-1 opacity-70">{card.sub}</div>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-navy flex items-center gap-2">
              <TrendingUp size={18} className="text-gold" />
              Lịch hẹn gần đây
            </h2>
            <Link href="/admin/appointments" className="text-gold text-sm hover:underline">Xem tất cả</Link>
          </div>
          {stats.recentAppointments.length === 0 ? (
            <p className="text-gray-text text-sm">Chưa có lịch hẹn nào.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between py-3 border-b border-gray-border last:border-0">
                  <div>
                    <div className="font-medium text-navy text-sm">{apt.fullName}</div>
                    <div className="text-gray-muted text-xs">{apt.phone} - {formatDate(apt.createdAt)}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-600">{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-navy flex items-center gap-2">
              <Users size={18} className="text-gold" />
              Chatbot leads
            </h2>
            <Link href="/admin/chatbot-leads" className="text-gold text-sm hover:underline">Xem tất cả</Link>
          </div>
          {stats.recentLeads.length === 0 ? (
            <p className="text-gray-text text-sm">Chưa có lead nào từ chatbot.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-3 border-b border-gray-border last:border-0">
                  <div>
                    <div className="font-medium text-navy text-sm">{lead.fullName ?? lead.phone ?? "Chưa có SĐT"}</div>
                    <div className="text-gray-muted text-xs">{lead.need ?? "-"} - {lead.area ?? "-"} - {formatDate(lead.createdAt)}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-600">{lead.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function safe<T>(callback: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await callback();
  } catch {
    return fallback;
  }
}
