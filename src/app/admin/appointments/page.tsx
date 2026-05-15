import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/lib/utils";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { WorkflowStatusBadge, WorkflowActionButtons } from "@/components/admin/WorkflowActions";
import { workflowStatusOptions } from "@/components/admin/StatusBadge";
import type { AppointmentStatus } from "@/generated/client/client";

export const metadata: Metadata = { title: "Quản lý Lịch hẹn | Admin" };
export const dynamic = "force-dynamic";

const statusValues = new Set(["new", "contacted", "advised", "completed", "cancelled"]);

export default async function AppointmentsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = statusValues.has(params.status ?? "") ? (params.status as AppointmentStatus) : undefined;
  const q = params.q?.trim() ?? "";
  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { need: { contains: q, mode: "insensitive" as const } },
            { budget: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      need: true,
      budget: true,
      appointmentTime: true,
      contactMethod: true,
      source: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <SectionHeader title="Lịch hẹn tư vấn" description={`${appointments.length} lịch hẹn theo bộ lọc hiện tại`} backHref="/admin" />

      <form className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-border bg-white p-4 sm:flex-row sm:items-center">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên, SĐT, nhu cầu..."
          className="min-h-10 flex-1 rounded-lg border border-gray-border px-3 text-sm outline-none focus:border-gold"
        />
        <select name="status" defaultValue={status ?? "all"} className="min-h-10 rounded-lg border border-gray-border bg-white px-3 text-sm outline-none focus:border-gold">
          {workflowStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button type="submit" className="min-h-10 rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-light">
          Lọc
        </button>
      </form>

      {appointments.length === 0 ? (
        <EmptyState icon={Calendar} title="Chưa có lịch hẹn phù hợp" description="Thử đổi bộ lọc hoặc từ khóa tìm kiếm." />
      ) : (
        <DataTable headers={["Khách hàng", "Nhu cầu", "Lịch hẹn", "Nguồn", "Trạng thái", "Thao tác", "Ngày tạo"]}>
          {appointments.map((apt) => (
            <tr key={apt.id} className="transition-colors hover:bg-gray-bg/50">
              <td className="px-5 py-4">
                <div className="font-semibold text-navy">{apt.fullName}</div>
                <a href={`tel:${apt.phone}`} className="text-sm text-gray-text hover:text-gold">{apt.phone}</a>
              </td>
              <td className="px-5 py-4 text-gray-text">
                <div className="max-w-[240px] line-clamp-2">{apt.need ?? "-"}</div>
                {apt.budget ? <div className="mt-1 text-xs text-gold-dark">{apt.budget}</div> : null}
              </td>
              <td className="px-5 py-4 text-sm text-gray-text">
                <div>{apt.appointmentTime ?? "-"}</div>
                {apt.contactMethod ? <div className="mt-1 text-xs text-gray-muted">{apt.contactMethod}</div> : null}
              </td>
              <td className="px-5 py-4 text-sm text-gray-text">{apt.source ?? "-"}</td>
              {/* ── Trạng thái (riêng cột) ── */}
              <td className="px-5 py-4">
                <WorkflowStatusBadge status={apt.status} />
              </td>
              {/* ── Thao tác (riêng cột) ── */}
              <td className="px-5 py-4">
                <WorkflowActionButtons id={apt.id} kind="appointment" status={apt.status} />
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-text">{formatDate(apt.createdAt)}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
