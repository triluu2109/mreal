"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageCircle, PhoneCall, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { updateContactStatus, deleteContact } from "@/app/actions/contact";

/** Renders only the action buttons (badge is rendered server-side in the page). */
export function ContactRowActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(status);

  function update(next: string) {
    startTransition(async () => {
      setOptimistic(next);
      const result = await updateContactStatus(id, next);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function remove() {
    if (!window.confirm("Xoá liên hệ này?")) return;
    startTransition(async () => {
      const result = await deleteContact(id);
      if (result.success) {
        toast.success("Đã xoá liên hệ");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => update("contacted")}
        disabled={isPending || optimistic === "contacted"}
        className="inline-flex h-7 items-center gap-1 rounded-lg bg-amber-50 px-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-40"
      >
        <PhoneCall size={11} />
        Liên lạc
      </button>
      <button
        type="button"
        onClick={() => update("consulting")}
        disabled={isPending || optimistic === "consulting"}
        className="inline-flex h-7 items-center gap-1 rounded-lg bg-violet-50 px-2 text-xs font-semibold text-violet-700 hover:bg-violet-100 disabled:opacity-40"
      >
        <MessageCircle size={11} />
        Tư vấn
      </button>
      <button
        type="button"
        onClick={() => update("closed")}
        disabled={isPending || optimistic === "closed"}
        className="inline-flex h-7 items-center gap-1 rounded-lg bg-emerald-50 px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
      >
        <CheckCircle2 size={11} />
        Chốt
      </button>
      <button
        type="button"
        onClick={() => update("cancelled")}
        disabled={isPending || optimistic === "cancelled"}
        className="inline-flex h-7 items-center gap-1 rounded-lg bg-red-50 px-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-40"
      >
        <XCircle size={11} />
        Huỷ
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={isPending}
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40"
        title="Xoá"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
