"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteButton({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Bạn có chắc chắn muốn xoá mục này? Hành động này không thể hoàn tác.")) return;

    startTransition(async () => {
      const res = await action(id);
      if (res.success) {
        toast.success("Đã xoá thành công");
        router.refresh();
      } else {
        toast.error(res.error || "Có lỗi xảy ra khi xoá");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      title="Xoá"
    >
      <Trash2 size={16} />
    </button>
  );
}
