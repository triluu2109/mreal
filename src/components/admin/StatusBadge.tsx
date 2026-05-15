import type { AppointmentStatus, LeadStatus } from "@/generated/client/client";
import { cn } from "@/lib/utils";

type WorkflowStatus = AppointmentStatus | LeadStatus;

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "Mới", className: "bg-blue-50 text-blue-700 ring-blue-100" },
  contacted: { label: "Đã liên lạc", className: "bg-amber-50 text-amber-700 ring-amber-100" },
  advised: { label: "Đang tư vấn", className: "bg-violet-50 text-violet-700 ring-violet-100" },
  completed: { label: "Đã chốt", className: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
  cancelled: { label: "Huỷ", className: "bg-red-50 text-red-700 ring-red-100" },
  done: { label: "Đã chốt", className: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
  draft: { label: "Nháp", className: "bg-slate-50 text-slate-700 ring-slate-100" },
  published: { label: "Đã xuất bản", className: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
  featured: { label: "Nổi bật", className: "bg-gold/10 text-gold-dark ring-gold/20" },
};

export function StatusBadge({ status, className }: { status: WorkflowStatus | "draft" | "published" | "featured"; className?: string }) {
  const config = statusConfig[status] ?? statusConfig.new;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", config.className, className)}>
      {config.label}
    </span>
  );
}

export const workflowStatusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "new", label: "Mới" },
  { value: "contacted", label: "Đã liên lạc" },
  { value: "advised", label: "Đang tư vấn" },
  { value: "completed", label: "Đã chốt" },
  { value: "cancelled", label: "Huỷ" },
] as const;
