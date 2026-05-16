import type { Metadata } from "next";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/lib/utils";
import { Mail, Phone } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { ContactRowActions } from "@/components/admin/ContactRowActions";
import { requirePagePermission } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Quản lý Liên hệ | Admin" };
export const dynamic = "force-dynamic";

export default async function ContactsAdminPage() {
  await requirePagePermission("contacts.manage");
  const contacts = await prisma.contact.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      message: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <SectionHeader
        title="Liên hệ"
        description={`${contacts.length} tin nhắn liên hệ`}
        backHref="/admin"
      />

      {contacts.length === 0 ? (
        <EmptyState icon={Mail} title="Chưa có tin nhắn liên hệ nào" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-gray-border bg-gray-bg text-xs font-semibold uppercase tracking-wide text-gray-text">
                <tr>
                  <th className="w-[200px] px-5 py-3.5">Khách hàng</th>
                  <th className="px-5 py-3.5">Nội dung</th>
                  <th className="w-[130px] px-5 py-3.5">Trạng thái</th>
                  <th className="w-[260px] px-5 py-3.5">Thao tác</th>
                  <th className="w-[110px] px-5 py-3.5">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-border">
                {contacts.map((c) => (
                  <ContactRow key={c.id} contact={c} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Separate the status badge so it sits in its own <td>
const STATUS_LABEL: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên lạc",
  consulting: "Đang tư vấn",
  closed: "Đã chốt",
  cancelled: "Huỷ",
};
const STATUS_CLS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-100",
  contacted: "bg-amber-50 text-amber-700 ring-amber-100",
  consulting: "bg-violet-50 text-violet-700 ring-violet-100",
  closed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  cancelled: "bg-red-50 text-red-700 ring-red-100",
};

type Contact = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  createdAt: Date;
};

function ContactRow({ contact: c }: { contact: Contact }) {
  const cls = STATUS_CLS[c.status] ?? STATUS_CLS.new;
  return (
    <tr className="transition-colors hover:bg-gray-bg/50">
      {/* Khách hàng */}
      <td className="px-5 py-4">
        <div className="font-semibold text-navy">{c.fullName}</div>
        <a href={`tel:${c.phone}`} className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-text hover:text-gold">
          <Phone size={13} />
          {c.phone}
        </a>
        {c.email && (
          <a href={`mailto:${c.email}`} className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-muted hover:text-gold">
            <Mail size={12} />
            {c.email}
          </a>
        )}
      </td>

      {/* Nội dung */}
      <td className="px-5 py-4">
        {c.message ? (
          <p className="line-clamp-3 max-w-[360px] text-sm leading-relaxed text-gray-text">
            {c.message}
          </p>
        ) : (
          <span className="text-xs text-gray-muted">-</span>
        )}
      </td>

      {/* Trạng thái — badge only, width: auto */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}
        >
          {STATUS_LABEL[c.status] ?? "Mới"}
        </span>
      </td>

      {/* Thao tác — action buttons only */}
      <td className="px-5 py-4">
        <ContactRowActions id={c.id} status={c.status} />
      </td>

      {/* Ngày */}
      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-muted">
        {formatDate(c.createdAt)}
      </td>
    </tr>
  );
}
