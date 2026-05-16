import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/lib/utils";
import { resolveStorageUrl } from "@/server/storage/resolve-url";

export const metadata: Metadata = {
  title: "Tin tức bất động sản | M-Real Estate",
  description: "Cập nhật tin tức, phân tích thị trường và kinh nghiệm thuê bán căn hộ tại Q7 Saigon Riverside Complex, Quận 7 và khu Nam Sài Gòn.",
};

export const revalidate = 3600;

async function getNews() {
  try {
    return await prisma.newsPost.findMany({
      where: { published: true, deletedAt: null },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
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
      },
    });
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const posts = await getNews();

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-navy-dark via-navy to-navy-light pt-32 pb-20">
          <div className="container-site text-center">
            <span className="section-label">Blog</span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              Tin tức & <span className="text-gradient-gold">Kiến thức</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Cập nhật thị trường, kinh nghiệm thuê bán căn hộ và góc nhìn chuyên sâu từ đội ngũ M-Real Estate.
            </p>
          </div>
        </section>

        <section className="section-padding bg-gray-bg">
          <div className="container-site">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-text text-lg">Chưa có bài viết nào. Vui lòng quay lại sau.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-border"
                  >
                    <div className="h-48 bg-gradient-to-br from-navy to-navy-light relative overflow-hidden">
                      {post.thumbnailPath ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveStorageUrl(post.thumbnailPath)}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-navy" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
                      {post.featured ? (
                        <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-white shadow-sm">
                          Nổi bật
                        </span>
                      ) : null}
                    </div>

                    <div className="p-6">
                      {(post.tags ?? []).length > 0 ? (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {(post.tags ?? []).slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full bg-gray-bg px-2 py-1 text-xs text-gray-text">{tag}</span>
                          ))}
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={14} className="text-gold" />
                        <span className="text-gray-muted text-xs">
                          {formatDate(post.publishedAt ?? post.createdAt)}
                        </span>
                      </div>
                      <h2 className="font-heading font-bold text-navy text-lg mb-3 group-hover:text-gold transition-colors line-clamp-2">
                        <Link href={`/news/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-text text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                      )}
                      <Link
                        href={`/news/${post.slug}`}
                        className="text-gold font-semibold text-sm hover:underline flex items-center gap-1"
                      >
                        Đọc thêm
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
