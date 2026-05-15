"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageCircle, PhoneCall, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { AppointmentStatus, LeadStatus } from "@/generated/client/client";
import { updateAppointmentStatus } from "@/app/actions/appointment";
import { deleteChatbotLead, updateChatbotLeadStatus } from "@/app/actions/chatbot-lead";
import { StatusBadge } from "./StatusBadge";

type Kind = "appointment" | "lead";
type WorkflowStatus = AppointmentStatus | LeadStatus;

// ─── Standalone badge (use in its own <td>) ───────────────────────────────────
export function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  return <StatusBadge status={status} />;
}

// ─── Action buttons (use in its own <td>) ─────────────────────────────────────
export function WorkflowActionButtons({
  id,
  kind,
  status,
  onOpenChat,
}: {
  id: string;
  kind: Kind;
  status: WorkflowStatus;
  onOpenChat?: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);

  function update(nextStatus: WorkflowStatus) {
    startTransition(async () => {
      setOptimisticStatus(nextStatus);
      const result =
        kind === "appointment"
          ? await updateAppointmentStatus(id, nextStatus as AppointmentStatus)
          : await updateChatbotLeadStatus(id, nextStatus as LeadStatus);

      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function remove() {
    if (!window.confirm("Xoá lead này?")) return;
    startTransition(async () => {
      const result = await deleteChatbotLead(id);
      if (result.success) {
        toast.success("Đã xoá lead");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const isContacted = optimisticStatus === "contacted";
  const isAdvised = optimisticStatus === "advised";
  const isCompleted = optimisticStatus === "completed" || optimisticStatus === "done";
  const isCancelled = optimisticStatus === "cancelled";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => update("contacted")}
        disabled={isPending || isContacted}
        title="Đã liên lạc"
        className="inline-flex h-8 items-center gap-1 rounded-lg bg-amber-50 px-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-40"
      >
        <PhoneCall size={12} />
        Liên lạc
      </button>
      <button
        type="button"
        onClick={() => update("advised")}
        disabled={isPending || isAdvised}
        title="Đang tư vấn"
        className="inline-flex h-8 items-center gap-1 rounded-lg bg-violet-50 px-2 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:opacity-40"
      >
        <MessageCircle size={12} />
        Tư vấn
      </button>
      <button
        type="button"
        onClick={() => update("completed")}
        disabled={isPending || isCompleted}
        title="Đã chốt"
        className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-50 px-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-40"
      >
        <CheckCircle2 size={12} />
        Chốt
      </button>
      <button
        type="button"
        onClick={() => update("cancelled")}
        disabled={isPending || isCancelled}
        title="Huỷ"
        className="inline-flex h-8 items-center gap-1 rounded-lg bg-red-50 px-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-40"
      >
        <XCircle size={12} />
        Huỷ
      </button>
      {kind === "lead" && onOpenChat && (
        <button
          type="button"
          onClick={onOpenChat}
          title="Xem lịch sử chat"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-border px-2 text-xs font-semibold text-navy transition-colors hover:bg-gray-bg"
        >
          Lịch sử
        </button>
      )}
      {kind === "lead" && (
        <button
          type="button"
          onClick={remove}
          disabled={isPending}
          title="Xoá lead"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

// ─── Legacy combined component (kept for backward compat) ─────────────────────
export function WorkflowActions({ id, kind, status }: { id: string; kind: Kind; status: WorkflowStatus }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <WorkflowStatusBadge status={status} />
      <WorkflowActionButtons id={id} kind={kind} status={status} />
    </div>
  );
}
