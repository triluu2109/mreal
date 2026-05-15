import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Quản lý Lịch hẹn | Admin" };
export const dynamic = "force-dynamic";

const statusMap = {
  new: { label: "Mới", style: "bg-blue-50 text-blue-600" },
  contacted: { label: "Đã liên hệ", style: "bg-yellow-50 text-yellow-600" },
  advised: { label: "Đã tư vấn", style: "bg-purple-50 text-purple-600" },
  completed: { label: "Hoàn tất", style: "bg-green-50 text-green-600" },
};

type AppointmentRow = {
  id: string;
  fullName: string;
  phone: string;
  need: string | null;
  budget: string | null;
  status: keyof typeof statusMap;
  createdAt: Date;
};

export default async function AppointmentsAdminPage() {
  let appointments: AppointmentRow[] = [];
  let error: string | null = null;

  try {
    appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        phone: true,
        need: true,
        budget: true,
        status: true,
        createdAt: true,
      },
    });
  } catch (err) {
    error = err instanceof Error ? err.message : "Lỗi kết nối database.";
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
        <p className="text-red-600 font-medium">Không thể tải dữ liệu lịch hẹn.</p>
        <p className="text-red-400 text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin" className="text-gray-text hover:text-navy">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Lịch hẹn tư vấn</h1>
          <p className="text-gray-text text-sm mt-1">{appointments.length} lịch hẹn tổng cộng</p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-border p-16 text-center">
          <p className="text-gray-text text-lg">Chưa có lịch hẹn nào.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-border bg-gray-bg">
                  {["Họ tên", "SĐT", "Nhu cầu", "Tài chính / ghi chú", "Trạng thái", "Ngày tạo"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-gray-text font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => {
                  const status = statusMap[apt.status] ?? statusMap.new;
                  return (
                    <tr key={apt.id} className="border-b border-gray-border last:border-0 hover:bg-gray-bg/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-navy whitespace-nowrap">{apt.fullName}</td>
                      <td className="px-5 py-4 text-gray-text">
                        <a href={`tel:${apt.phone}`} className="hover:text-gold">{apt.phone}</a>
                      </td>
                      <td className="px-5 py-4 text-gray-text max-w-[200px]">
                        <span className="line-clamp-2">{apt.need ?? "—"}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-text max-w-[180px]">
                        <span className="line-clamp-2">{apt.budget ?? "—"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.style}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-text whitespace-nowrap">{formatDate(apt.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
