"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNewsPost } from "@/app/actions/news";

export default function CreateNewsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("published", published ? "true" : "false");

    startTransition(async () => {
      const result = await createNewsPost(formData);
      if (result.success) {
        router.push("/admin/news");
      } else {
        setError(result.error ?? "Có lỗi xảy ra");
      }
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/news" className="text-gray-text hover:text-navy">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">Tạo bài viết mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-border p-6 space-y-5">
          <div>
            <Label htmlFor="title" className="text-navy font-medium mb-1.5 block">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input id="title" name="title" placeholder="Nhập tiêu đề bài viết..." required />
          </div>

          <div>
            <Label htmlFor="slug" className="text-navy font-medium mb-1.5 block">
              Slug (URL) <span className="text-red-500">*</span>
            </Label>
            <Input id="slug" name="slug" placeholder="viet-tat-url-bai-viet" required />
            <p className="text-gray-muted text-xs mt-1">
              Dùng chữ thường, dấu gạch ngang. VD: thi-truong-bds-2025
            </p>
          </div>

          <div>
            <Label htmlFor="excerpt" className="text-navy font-medium mb-1.5 block">
              Tóm tắt
            </Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              placeholder="Mô tả ngắn về bài viết (hiển thị trong danh sách)..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-navy font-medium mb-1.5 block">
              Nội dung
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Nội dung bài viết (hỗ trợ HTML)..."
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="thumbnailUrl" className="text-navy font-medium mb-1.5 block">
              URL Thumbnail
            </Label>
            <Input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-navy">Trạng thái xuất bản</div>
              <div className="text-gray-text text-sm mt-0.5">
                {published ? "Bài viết sẽ hiển thị công khai" : "Lưu nháp, chưa xuất bản"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                published
                  ? "border-green-500 text-green-600 bg-green-50"
                  : "border-gray-border text-gray-text bg-gray-bg"
              }`}
            >
              {published ? <><Eye size={16} />Xuất bản</> : <><EyeOff size={16} />Nháp</>}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="btn-gold px-10 py-3 disabled:opacity-70"
          >
            {isPending ? <><Loader2 size={18} className="animate-spin" />Đang lưu...</> : "Lưu bài viết"}
          </button>
          <Link href="/admin/news" className="btn-navy-outline px-8 py-3">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
