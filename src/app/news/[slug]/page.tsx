import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Facebook, Link2, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/lib/utils";
import { resolveStorageUrl } from "@/server/storage/resolve-url";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.newsPost.findFirst({
    where: { slug, published: true, deletedAt: null },
    select: { title: true, excerpt: true, thumbnailPath: true, seoTitle: true, seoDescription: true },
  });

  if (!post) return { title: "Bài viết không tồn tại | M-Real Estate" };

  const title = post.seoTitle || `${post.title} | M-Real Estate`;
  const description = post.seoDescription || post.excerpt || undefined;
  const image = post.thumbnailPath ? resolveStorageUrl(post.thumbnailPath) : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [{ url: image, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.newsPost.findFirst({ where: { slug, published: true, deletedAt: null } });
  if (!post) notFound();

  const tagMatchedPosts = post.tags.length > 0
    ? await prisma.newsPost.findMany({
        where: { published: true, deletedAt: null, slug: { not: slug }, tags: { hasSome: post.tags } },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 3,
        select: { id: true, title: true, slug: true, excerpt: true, thumbnailPath: true, publishedAt: true, createdAt: true },
      })
    : [];
  const fallbackPosts = tagMatchedPosts.length < 3
    ? await prisma.newsPost.findMany({
        where: { published: true, deletedAt: null, slug: { not: slug }, id: { notIn: tagMatchedPosts.map((item) => item.id) } },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        take: 3 - tagMatchedPosts.length,
        select: { id: true, title: true, slug: true, excerpt: true, thumbnailPath: true, publishedAt: true, createdAt: true },
      })
    : [];
  const relatedPosts = [...tagMatchedPosts, ...fallbackPosts];

  const thumbnailUrl = post.thumbnailPath ? resolveStorageUrl(post.thumbnailPath) : null;
  const publishedDate = post.publishedAt ?? post.createdAt;
  const articleUrl = `/news/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: thumbnailUrl ? [thumbnailUrl] : undefined,
    datePublished: publishedDate.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "M-Real Estate" },
    publisher: { "@type": "Organization", name: "M-Real Estate" },
  };

  return (
    <>
      <Header />
      <main className="bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* ── Hero ── */}
        <section className="bg-navy pt-8 pb-10">
          <div className="mx-auto max-w-[860px] px-4 sm:px-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-white/55">
              <Link href="/" className="shrink-0 hover:text-gold transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link href="/news" className="shrink-0 hover:text-gold transition-colors">Tin tức</Link>
              <span>/</span>
              <span className="min-w-0 flex-1 truncate text-white/75">{post.title}</span>
            </nav>

            {/* Back link */}
            <Link
              href="/news"
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-white transition-colors"
            >
              <ArrowLeft size={15} />
              Quay lại tin tức
            </Link>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-gold" />
                {formatDate(publishedDate)}
              </span>
              {post.content ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-gold" />
                  {estimateReadTime(post.content)} phút đọc
                </span>
              ) : null}
              {/* Tags */}
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="mt-4 font-heading text-2xl font-extrabold leading-snug text-white sm:text-3xl md:text-4xl">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt ? (
              <p className="mt-3 text-base leading-7 text-white/70 md:text-lg md:leading-8">
                {post.excerpt}
              </p>
            ) : null}
          </div>
        </section>

        {/* ── Article body ── */}
        <div className="mx-auto max-w-[860px] px-4 py-10 sm:px-6 sm:py-12">
          {/* Mobile share row */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="text-sm font-semibold text-gray-text">Chia sẻ:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-border text-navy hover:border-gold hover:text-gold transition-colors"
            >
              <Facebook size={16} />
            </a>
            <button
              type="button"
              onClick={undefined}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-border text-navy hover:border-gold hover:text-gold transition-colors"
              aria-label="Copy link"
            >
              <Link2 size={16} />
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-border px-3 text-xs font-semibold text-navy hover:border-gold hover:text-gold transition-colors"
            >
              <Share2 size={13} />
              Chia sẻ
            </button>
          </div>

          {/* Sticky social share — desktop only, absolutely positioned to NOT affect content width */}
          <div className="relative">
            <aside className="absolute -left-16 top-0 hidden h-full lg:block">
              <div className="sticky top-28 flex flex-col gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Chia sẻ Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-border bg-white text-navy shadow-sm hover:border-gold hover:text-gold transition-colors"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href={articleUrl}
                  title="Copy link"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-border bg-white text-navy shadow-sm hover:border-gold hover:text-gold transition-colors"
                >
                  <Link2 size={16} />
                </a>
              </div>
            </aside>

            {/* Article content */}
            <article className="prose-article">
              {post.content
                ? <MarkdownRenderer content={post.content} />
                : <p className="py-12 text-center text-gray-text">Nội dung đang được cập nhật.</p>
              }
            </article>
          </div>

          {/* Bottom back link */}
          <div className="mt-10 border-t border-gray-border pt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-border px-5 py-3 font-semibold text-navy hover:bg-gray-bg transition-colors"
            >
              <ArrowLeft size={16} />
              Xem thêm bài viết
            </Link>
          </div>
        </div>

        {/* ── Related posts ── */}
        {relatedPosts.length > 0 ? (
          <section className="border-t border-gray-border bg-gray-bg py-12 sm:py-16">
            <div className="container-site">
              <h2 className="mb-8 font-heading text-2xl font-bold text-navy">Bài viết liên quan</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedPosts.map((related) => {
                  const image = resolveStorageUrl(related.thumbnailPath);
                  return (
                    <article
                      key={related.id}
                      className="group overflow-hidden rounded-xl border border-gray-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-hover"
                    >
                      <Link href={`/news/${related.slug}`} className="block">
                        <div className="relative aspect-[16/9] bg-navy">
                          {image ? (
                            <Image
                              src={image}
                              alt={related.title}
                              fill
                              sizes="(min-width: 768px) 33vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : null}
                        </div>
                        <div className="p-5">
                          <div className="mb-2 flex items-center gap-2 text-xs text-gray-muted">
                            <Calendar size={12} className="text-gold" />
                            {formatDate(related.publishedAt ?? related.createdAt)}
                          </div>
                          <h3 className="line-clamp-2 font-heading font-bold text-navy transition-colors group-hover:text-gold">
                            {related.title}
                          </h3>
                          {related.excerpt ? (
                            <p className="mt-2 line-clamp-2 text-sm text-gray-text">{related.excerpt}</p>
                          ) : null}
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
