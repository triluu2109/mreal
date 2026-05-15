"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadField from "@/app/admin/_components/ImageUploadField";
import { createNewsPost, updateNewsPost } from "@/app/actions/news";
import { slugify } from "@/lib/utils";
import { MarkdownEditor } from "./MarkdownEditor";

export type NewsFormInitialData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  thumbnailPath: string | null;
  featured: boolean;
  published: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  tags: string[] | null;
};

type NewsFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailPaths: string[];
  featured: boolean;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  tags: string;
};

export function NewsForm({ initialData = null }: { initialData?: NewsFormInitialData | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData?.slug));
  const [form, setForm] = useState<NewsFormState>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    thumbnailPaths: initialData?.thumbnailPath ? [initialData.thumbnailPath] : [],
    featured: initialData?.featured ?? false,
    published: initialData?.published ?? false,
    seoTitle: initialData?.seoTitle ?? "",
    seoDescription: initialData?.seoDescription ?? "",
    tags: initialData?.tags?.join(", ") ?? "",
  });

  useEffect(() => {
    if (!slugTouched) {
      setForm((current) => ({ ...current, slug: slugify(current.title) }));
    }
  }, [form.title, slugTouched]);

  function setField<K extends keyof NewsFormState>(key: K, value: NewsFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.set("title", form.title);
    formData.set("slug", form.slug);
    formData.set("excerpt", form.excerpt);
    formData.set("content", form.content);
    formData.set("thumbnailPath", form.thumbnailPaths[0] ?? "");
    formData.set("featured", form.featured ? "true" : "false");
    formData.set("published", form.published ? "true" : "false");
    formData.set("seoTitle", form.seoTitle);
    formData.set("seoDescription", form.seoDescription);
    formData.set("tags", form.tags);

    startTransition(async () => {
      const result = initialData?.id
        ? await updateNewsPost(initialData.id, formData)
        : await createNewsPost(formData);

      if (result.success) {
        window.localStorage.removeItem(`news-draft:${initialData?.id ?? "new"}`);
        toast.success(initialData?.id ? "Đã cập nhật bài viết" : "Đã tạo bài viết");
        router.push("/admin/news");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const uploadDirectory = `news/${form.slug || "draft"}`;
  const tagPreview = form.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-border bg-white p-6">
          <div className="grid gap-5">
            <div>
              <Label htmlFor="title" className="mb-1.5 block font-medium text-navy">Tiêu đề *</Label>
              <Input id="title" value={form.title} onChange={(event) => setField("title", event.target.value)} required placeholder="Nhập tiêu đề bài viết..." />
            </div>
            <div>
              <Label htmlFor="slug" className="mb-1.5 block font-medium text-navy">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setField("slug", slugify(event.target.value));
                }}
                required
                placeholder="duong-dan-bai-viet"
              />
            </div>
            <div>
              <Label htmlFor="excerpt" className="mb-1.5 block font-medium text-navy">Tóm tắt</Label>
              <Textarea id="excerpt" value={form.excerpt} onChange={(event) => setField("excerpt", event.target.value)} rows={3} placeholder="Mô tả ngắn hiển thị ở danh sách và SEO..." />
            </div>
          </div>
        </div>

        <MarkdownEditor value={form.content} onChange={(value) => setField("content", value)} draftKey={`news-draft:${initialData?.id ?? "new"}`} />

        <div className="rounded-2xl border border-gray-border bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-bold text-navy">SEO</h2>
          <div className="grid gap-5">
            <div>
              <Label htmlFor="seoTitle" className="mb-1.5 block font-medium text-navy">SEO title</Label>
              <Input id="seoTitle" value={form.seoTitle} onChange={(event) => setField("seoTitle", event.target.value)} placeholder="Mặc định dùng tiêu đề bài viết" />
            </div>
            <div>
              <Label htmlFor="seoDescription" className="mb-1.5 block font-medium text-navy">SEO description</Label>
              <Textarea id="seoDescription" value={form.seoDescription} onChange={(event) => setField("seoDescription", event.target.value)} rows={3} placeholder="Mặc định dùng tóm tắt" />
            </div>
            <div>
              <Label htmlFor="tags" className="mb-1.5 block font-medium text-navy">Tags</Label>
              <Input id="tags" value={form.tags} onChange={(event) => setField("tags", event.target.value)} placeholder="q7, can ho, thi truong" />
              {tagPreview.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tagPreview.map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-bg px-2.5 py-1 text-xs font-medium text-gray-text">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-gray-border bg-white p-5">
          <h2 className="mb-4 font-heading text-lg font-bold text-navy">Xuất bản</h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setField("published", !form.published)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold ${form.published ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-border bg-gray-bg text-gray-text"}`}
            >
              <span className="inline-flex items-center gap-2">{form.published ? <Eye size={16} /> : <EyeOff size={16} />}{form.published ? "Đã xuất bản" : "Nháp"}</span>
              <span>{form.published ? "On" : "Off"}</span>
            </button>
            <button
              type="button"
              onClick={() => setField("featured", !form.featured)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold ${form.featured ? "border-gold/30 bg-gold/10 text-gold-dark" : "border-gray-border bg-gray-bg text-gray-text"}`}
            >
              <span className="inline-flex items-center gap-2"><Star size={16} />Nổi bật</span>
              <span>{form.featured ? "On" : "Off"}</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-border bg-white p-5">
          <ImageUploadField value={form.thumbnailPaths} onChange={(paths) => setField("thumbnailPaths", paths.slice(0, 1))} directory={uploadDirectory} />
        </div>

        <div className="flex flex-col gap-3">
          <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-3 font-semibold text-white hover:bg-gold-dark disabled:opacity-70">
            {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
            {initialData?.id ? "Cập nhật bài viết" : "Lưu bài viết"}
          </button>
          <Link href="/admin/news" className="inline-flex items-center justify-center rounded-lg border border-gray-border px-5 py-3 font-semibold text-navy hover:bg-gray-bg">
            Huỷ
          </Link>
        </div>
      </aside>
    </form>
  );
}
