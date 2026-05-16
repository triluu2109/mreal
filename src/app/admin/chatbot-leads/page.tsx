import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/lib/utils";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { WorkflowStatusBadge, WorkflowActionButtons } from "@/components/admin/WorkflowActions";
import { workflowStatusOptions } from "@/components/admin/StatusBadge";
import { ChatHistoryButton } from "@/components/admin/ChatHistoryModal";
import type { LeadStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Chatbot Leads | Admin" };
export const dynamic = "force-dynamic";

const pageSize = 20;
const statusValues = new Set(["new", "contacted", "advised", "completed", "cancelled", "done"]);

export default async function ChatbotLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = statusValues.has(params.status ?? "") ? (params.status as LeadStatus) : undefined;
  const q = params.q?.trim() ?? "";
  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { need: { contains: q, mode: "insensitive" as const } },
            { area: { contains: q, mode: "insensitive" as const } },
            { budget: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [leads, total] = await Promise.all([
    prisma.chatbotLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.chatbotLead.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <SectionHeader title="Chatbot Leads" description={`${total} leads theo bộ lọc hiện tại`} backHref="/admin" />

      <form className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-border bg-white p-4 sm:flex-row sm:items-center">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên, SĐT, nhu cầu, khu vực..."
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

      {leads.length === 0 ? (
        <EmptyState icon={MessageSquare} title="Chưa có lead phù hợp" description="Thử đổi bộ lọc hoặc từ khóa tìm kiếm." />
      ) : (
        <DataTable headers={["Khách hàng", "Nhu cầu", "Thông tin", "Trạng thái", "Thao tác", "Ngày tạo"]}>
          {leads.map((lead) => (
            <tr key={lead.id} className="transition-colors hover:bg-gray-bg/50">
              <td className="px-5 py-4">
                <div className="font-semibold text-navy">{lead.fullName ?? "Chưa có tên"}</div>
                {lead.phone
                  ? <a href={`tel:${lead.phone}`} className="text-sm text-gray-text hover:text-gold">{lead.phone}</a>
                  : <span className="text-sm text-gray-muted">Chưa có SĐT</span>}
                {/* Chat history inline */}
                {lead.conversation && (
                  <div className="mt-1.5">
                    <ChatHistoryButton
                      conversation={lead.conversation}
                      name={lead.fullName ?? lead.phone ?? "Lead"}
                    />
                  </div>
                )}
              </td>
              <td className="px-5 py-4 text-sm text-gray-text">
                <div className="max-w-[220px] line-clamp-2">{lead.need ?? "-"}</div>
                {lead.budget ? <div className="mt-1 text-xs font-semibold text-gold-dark">{lead.budget}</div> : null}
              </td>
              <td className="px-5 py-4 text-sm text-gray-text">
                <div>{[lead.area, lead.bedrooms ? `${lead.bedrooms} PN` : null].filter(Boolean).join(" · ") || "-"}</div>
                <div className="mt-1 text-xs text-gray-muted">{[lead.neededTime, lead.purpose, lead.contactMethod].filter(Boolean).join(" · ")}</div>
              </td>
              {/* ── Trạng thái (riêng cột) ── */}
              <td className="px-5 py-4">
                <WorkflowStatusBadge status={lead.status} />
              </td>
              {/* ── Thao tác (riêng cột) ── */}
              <td className="px-5 py-4">
                <WorkflowActionButtons id={lead.id} kind="lead" status={lead.status} />
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-text">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </DataTable>
      )}

      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Link
              key={pageNumber}
              href={`/admin/chatbot-leads?page=${pageNumber}&status=${status ?? "all"}&q=${encodeURIComponent(q)}`}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${pageNumber === page ? "bg-gold text-white" : "border border-gray-border bg-white text-gray-text"}`}
            >
              {pageNumber}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
