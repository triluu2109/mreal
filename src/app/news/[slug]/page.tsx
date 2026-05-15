import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { prisma } from "@/prisma";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await prisma.newsPost.findUnique({
      where: { slug, published: true },
      select: { title: true, excerpt: true },
    });
    if (!post) return { title: "Bài viết không tồn tại" };
    return {
      title: post.title,
      description: post.excerpt ?? undefined,
    };
  } catch {
    return { title: "Tin tức" };
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await prisma.newsPost.findUnique({
      where: { slug, published: true },
    });

    if (!post) notFound();

    return (
      <>
        <Header />
        <main>
          <section className="bg-gradient-to-br from-navy-dark via-navy to-navy-light pt-32 pb-16">
            <div className="container-site max-w-3xl">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors mb-6 text-sm"
              >
                <ArrowLeft size={16} />
                Quay lại danh sách
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={14} className="text-gold" />
                <span className="text-white/60 text-sm">
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-white/70 text-lg mt-4">{post.excerpt}</p>
              )}
            </div>
          </section>

          <section className="section-padding bg-white">
            <div className="container-site max-w-3xl">
              {post.content ? (
                <div
                  className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-gold"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-gray-text">Nội dung đang được cập nhật...</p>
              )}

              <div className="mt-12 pt-8 border-t border-gray-border">
                <Link href="/news" className="btn-navy-outline">
                  ← Xem thêm bài viết
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  } catch {
    notFound();
  }
}
