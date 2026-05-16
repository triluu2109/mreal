import type { Metadata } from "next";
import { FileText, Plus } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/lib/utils";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { NewsRowActions } from "./NewsRowActions";
import { requirePagePermission } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Quản lý Bài viết | Admin" };
export const dynamic = "force-dynamic";

export default async function NewsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; published?: string; featured?: string }>;
}) {
  await requirePagePermission("news.manage");
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const published = params.published === "true" ? true : params.published === "false" ? false : undefined;
  const featured = params.featured === "true" ? true : params.featured === "false" ? false : undefined;
  const where = {
    deletedAt: null,
    ...(published !== undefined ? { published } : {}),
    ...(featured !== undefined ? { featured } : {}),
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const posts = await prisma.newsPost.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      featured: true,
      publishedAt: true,
      createdAt: true,
      excerpt: true,
      tags: true,
    },
  });

  return (
    <div>
      <SectionHeader
        title="Bài viết"
        description={`${posts.length} bài viết theo bộ lọc hiện tại`}
        backHref="/admin"
        actionHref="/admin/news/create"
        actionLabel="Tạo bài viết"
        ActionIcon={Plus}
      />

      <form className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-border bg-white p-4 sm:flex-row sm:items-center">
        <input name="q" defaultValue={q} placeholder="Tìm theo tiêu đề..." className="min-h-10 flex-1 rounded-lg border border-gray-border px-3 text-sm outline-none focus:border-gold" />
        <select name="published" defaultValue={published === undefined ? "all" : String(published)} className="min-h-10 rounded-lg border border-gray-border bg-white px-3 text-sm outline-none focus:border-gold">
          <option value="all">Tất cả trạng thái</option>
          <option value="true">Đã xuất bản</option>
          <option value="false">Nháp</option>
        </select>
        <select name="featured" defaultValue={featured === undefined ? "all" : String(featured)} className="min-h-10 rounded-lg border border-gray-border bg-white px-3 text-sm outline-none focus:border-gold">
          <option value="all">Tất cả nổi bật</option>
          <option value="true">Nổi bật</option>
          <option value="false">Không nổi bật</option>
        </select>
        <button type="submit" className="min-h-10 rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-light">Lọc</button>
      </form>

      {posts.length === 0 ? (
        <EmptyState icon={FileText} title="Chưa có bài viết phù hợp" actionHref="/admin/news/create" actionLabel="Tạo bài viết đầu tiên" />
      ) : (
        <DataTable headers={["Tiêu đề", "Tags", "Trạng thái", "Ngày", "Thao tác"]}>
          {posts.map((post) => (
            <NewsRow key={post.id} post={post} />
          ))}
        </DataTable>
      )}
    </div>
  );
}

type NewsAdminPost = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  excerpt: string | null;
  tags: string[] | null;
};

function NewsRow({ post }: { post: NewsAdminPost }) {
  const tags = post.tags ?? [];

  return (
    <tr className="transition-colors hover:bg-gray-bg/50">
      <td className="px-5 py-4">
        <div className="max-w-[360px] truncate font-semibold text-navy">{post.title}</div>
        {post.excerpt ? <div className="mt-1 max-w-[420px] truncate text-xs text-gray-muted">{post.excerpt}</div> : null}
        <div className="mt-1 font-mono text-xs text-gray-muted">{post.slug}</div>
      </td>
      <td className="px-5 py-4">
        <div className="flex max-w-[220px] flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-gray-bg px-2 py-1 text-xs text-gray-text">{tag}</span>
          ))}
          {tags.length === 0 ? <span className="text-xs text-gray-muted">-</span> : null}
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={post.published ? "published" : "draft"} />
          {post.featured ? <StatusBadge status="featured" /> : null}
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-text">{formatDate(post.publishedAt ?? post.createdAt)}</td>
      <td className="px-5 py-4">
        <NewsRowActions id={post.id} slug={post.slug} published={post.published} featured={post.featured} />
      </td>
    </tr>
  );
}
