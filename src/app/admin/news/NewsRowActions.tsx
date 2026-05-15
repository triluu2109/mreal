"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteNewsPost, toggleNewsPostFeatured, toggleNewsPostPublished } from "@/app/actions/news";

export function NewsRowActions({
  id,
  slug,
  published,
  featured,
}: {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useOptimistic({ published, featured });

  function togglePublished() {
    const next = !state.published;
    startTransition(async () => {
      setState({ ...state, published: next });
      const result = await toggleNewsPostPublished(id, next);
      if (!result.success) toast.error(result.error);
      router.refresh();
    });
  }

  function toggleFeatured() {
    const next = !state.featured;
    startTransition(async () => {
      setState({ ...state, featured: next });
      const result = await toggleNewsPostFeatured(id, next);
      if (!result.success) toast.error(result.error);
      router.refresh();
    });
  }

  function remove() {
    if (!window.confirm("Xoá bài viết này?")) return;
    startTransition(async () => {
      const result = await deleteNewsPost(id);
      if (result.success) {
        toast.success("Đã xoá bài viết");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/news/${id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100" title="Sửa">
        <Pencil size={15} />
      </Link>
      <button type="button" onClick={toggleFeatured} disabled={isPending} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold-dark hover:bg-gold/20 disabled:opacity-50" title="Nổi bật">
        <Star size={15} fill={state.featured ? "currentColor" : "none"} />
      </button>
      <button type="button" onClick={togglePublished} disabled={isPending} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50" title="Publish / unpublish">
        {state.published ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
      <Link href={`/news/${slug}`} target="_blank" className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-border px-2 text-xs font-semibold text-navy hover:bg-gray-bg">
        Xem
      </Link>
      <button type="button" onClick={remove} disabled={isPending} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50" title="Xoá">
        <Trash2 size={15} />
      </button>
    </div>
  );
}
