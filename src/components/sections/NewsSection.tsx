import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronRight, Clock } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/lib/utils";
import { resolveStorageUrl } from "@/server/storage/resolve-url";
import { siteImages } from "@/config/images";
import { getImageUrl } from "@/lib/image";

type HomeNewsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnailPath: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  featured: boolean;
  tags: string[] | null;
  content: string | null;
};

async function getHomeNews(): Promise<HomeNewsPost[]> {
  try {
    return await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnailPath: true,
        publishedAt: true,
        createdAt: true,
        featured: true,
        tags: true,
        content: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function NewsSection() {
  const posts = await getHomeNews();
  const [featuredPost, ...sidePosts] = posts;
  const fallbackImage = getImageUrl(siteImages.project.q7SaigonRiverside.gallery[3]);

  if (!featuredPost) return null;

  return (
    <section className="section-padding bg-gray-bg" id="news">
      <div className="container-site">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="section-label mb-2 block">Blog & Tin tức</span>
            <h2 className="font-heading text-2xl font-bold leading-tight text-[#1A1A1A] md:text-4xl">
              Tin tức <span className="text-orange">mới nhất</span>
            </h2>
          </div>
          <Link href="/news" className="inline-flex items-center gap-1 text-sm font-semibold text-orange transition-all hover:gap-2">
            Xem tất cả <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <article className="group lg:col-span-3">
            <Link href={`/news/${featuredPost.slug}`} className="block">
              <div className="relative mb-5 h-72 overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:shadow-hover">
                <Image
                  src={resolveStorageUrl(featuredPost.thumbnailPath) || fallbackImage}
                  alt={featuredPost.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {featuredPost.featured ? <span className="rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-white">Nổi bật</span> : null}
                  {(featuredPost.tags ?? []).slice(0, 1).map((tag) => (
                    <span key={tag} className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy">{tag}</span>
                  ))}
                </div>
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold leading-snug text-[#1A1A1A] transition-colors group-hover:text-orange">
                {featuredPost.title}
              </h3>
              {featuredPost.excerpt ? <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-text">{featuredPost.excerpt}</p> : null}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(featuredPost.publishedAt ?? featuredPost.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {estimateReadTime(featuredPost.content)} phút đọc
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange">
                  Đọc tiếp <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </article>

          <div className="lg:col-span-2">
            <div className="flex flex-col divide-y divide-gray-200">
              {sidePosts.slice(0, 5).map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="group py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-navy">
                      <Image
                        src={resolveStorageUrl(post.thumbnailPath) || fallbackImage}
                        alt={post.title}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap gap-1.5">
                        {post.featured ? <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold-dark">Nổi bật</span> : null}
                        {(post.tags ?? []).slice(0, 1).map((tag) => (
                          <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-text">{tag}</span>
                        ))}
                      </div>
                      <h4 className="line-clamp-2 font-heading text-sm font-semibold leading-snug text-[#1A1A1A] transition-colors group-hover:text-orange">
                        {post.title}
                      </h4>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-muted">
                        <Calendar size={10} />
                        {formatDate(post.publishedAt ?? post.createdAt)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function estimateReadTime(content: string | null): number {
  if (!content) return 1;
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));
}
