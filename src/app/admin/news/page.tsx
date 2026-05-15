import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, FileText, Globe, EyeOff, Eye } from "lucide-react";

export const metadata: Metadata = { title: "Quản lý Bài viết | Admin" };
export const dynamic = "force-dynamic";

export default async function NewsAdminPage() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      publishedAt: true,
      createdAt: true,
      excerpt: true,
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-text hover:text-navy">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-navy">Bài viết</h1>
            <p className="text-gray-text text-sm mt-1">{posts.length} bài viết</p>
          </div>
        </div>
        <Link
          href="/admin/news/create"
          className="btn-gold text-sm py-2.5 px-5"
        >
          + Tạo bài viết mới
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-border p-16 text-center">
          <FileText size={48} className="text-gray-border mx-auto mb-4" />
          <p className="text-gray-text text-lg mb-4">Chưa có bài viết nào.</p>
          <Link href="/admin/news/create" className="btn-gold px-8">
            Tạo bài viết đầu tiên
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-border bg-gray-bg">
                {["Tiêu đề", "Slug", "Trạng thái", "Ngày tạo", "Thao tác"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-gray-text font-semibold text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-border last:border-0 hover:bg-gray-bg/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-navy max-w-xs truncate">{post.title}</div>
                    {post.excerpt && (
                      <div className="text-gray-muted text-xs mt-0.5 max-w-xs truncate">
                        {post.excerpt}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-text font-mono text-xs">{post.slug}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                        post.published
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {post.published ? (
                        <><Eye size={12} />Đã xuất bản</>
                      ) : (
                        <><EyeOff size={12} />Nháp</>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-text">{formatDate(post.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/news/${post.id}/edit`}
                        className="text-gold hover:underline text-xs font-medium"
                      >
                        Sửa
                      </Link>
                      <span className="text-gray-border">·</span>
                      <Link
                        href={`/news/${post.slug}`}
                        target="_blank"
                        className="text-navy hover:text-gold transition-colors"
                        title="Xem bài viết"
                      >
                        <Globe size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
