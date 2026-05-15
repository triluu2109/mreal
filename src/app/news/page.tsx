import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { prisma } from "@/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tin tức bất động sản",
  description: "Cập nhật tin tức, phân tích thị trường và kinh nghiệm bất động sản TP.HCM mới nhất.",
};

export const revalidate = 3600; // revalidate every hour

async function getNews() {
  try {
    return await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnailUrl: true,
        publishedAt: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

// Fallback articles for when DB has no data
const fallbackPosts = [
  {
    id: "1",
    title: "Thị trường bất động sản TP.HCM 2025: Xu hướng và cơ hội",
    slug: "thi-truong-bds-tphcm-2025",
    excerpt: "Phân tích chi tiết xu hướng thị trường bất động sản TP.HCM năm 2025 và những cơ hội đầu tư không thể bỏ qua.",
    thumbnailUrl: null,
    publishedAt: new Date("2025-01-15"),
    createdAt: new Date("2025-01-15"),
    gradient: "from-navy to-navy-light",
  },
  {
    id: "2",
    title: "Kinh nghiệm mua nhà lần đầu: 10 điều cần biết",
    slug: "kinh-nghiem-mua-nha-lan-dau",
    excerpt: "Hướng dẫn chi tiết cho người mua nhà lần đầu — từ chuẩn bị tài chính đến ký hợp đồng công chứng.",
    thumbnailUrl: null,
    publishedAt: new Date("2025-02-01"),
    createdAt: new Date("2025-02-01"),
    gradient: "from-gold-dark to-gold",
  },
  {
    id: "3",
    title: "So sánh đầu tư chung cư vs nhà phố tại TP.HCM",
    slug: "so-sanh-dau-tu-chung-cu-vs-nha-pho",
    excerpt: "Phân tích ưu nhược điểm, tỷ suất sinh lời và tính thanh khoản của hai loại hình bất động sản phổ biến nhất.",
    thumbnailUrl: null,
    publishedAt: new Date("2025-02-20"),
    createdAt: new Date("2025-02-20"),
    gradient: "from-navy-light to-navy",
  },
];

const gradients = [
  "from-navy to-navy-light",
  "from-gold-dark to-gold",
  "from-navy-light to-navy",
  "from-indigo-800 to-navy",
];

export default async function NewsPage() {
  const posts = await getNews();
  const displayPosts = posts.length > 0
    ? posts.map((p, i) => ({ ...p, gradient: gradients[i % gradients.length] }))
    : fallbackPosts;

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-dark via-navy to-navy-light pt-32 pb-20">
          <div className="container-site text-center">
            <span className="section-label">Blog</span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              Tin tức & <span className="text-gradient-gold">Kiến thức</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Cập nhật thị trường, kinh nghiệm và góc nhìn chuyên sâu từ đội ngũ M-Real Estate.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="section-padding bg-gray-bg">
          <div className="container-site">
            {displayPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-text text-lg">Chưa có bài viết nào. Vui lòng quay lại sau.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-border"
                  >
                    {/* Thumbnail */}
                    <div className={`h-48 bg-gradient-to-br ${(post as typeof fallbackPosts[0]).gradient} relative overflow-hidden`}>
                      {post.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <div className="w-24 h-24 border-4 border-white rounded-lg rotate-12" />
                          <div className="w-16 h-16 border-4 border-white rounded-lg -rotate-6 absolute" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
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
                        Đọc thêm →
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
