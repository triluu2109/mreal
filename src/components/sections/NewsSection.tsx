"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Clock, ArrowRight } from "lucide-react";

const featuredArticle = {
  id: "featured",
  title: "Thị trường bất động sản TP.HCM 2025: Cơ hội và thách thức",
  excerpt:
    "Với những chính sách mới từ Nhà nước và sự phục hồi của nền kinh tế, thị trường bất động sản TP.HCM đang bước vào giai đoạn tăng trưởng mới. Bài viết phân tích các xu hướng chủ đạo và cơ hội đầu tư nổi bật trong năm 2025.",
  date: "10/05/2025",
  readTime: "5 phút đọc",
  category: "Thị trường",
  image: "/assets/project/z7579009750275_813cbc6e7e3e7f4eba39cccd71918150.jpg",
};

const articles = [
  {
    id: "1",
    title: "Lãi suất ngân hàng giảm: Cơ hội vàng cho người mua nhà lần đầu",
    date: "08/05/2025",
    category: "Tài chính",
    image: "/assets/project/z7579009812832_25b90ef65c6c1ebb37910368cda901eb.jpg",
  },
  {
    id: "2",
    title: "Phân khúc căn hộ vừa túi tiền đang trở lại mạnh mẽ tại TP.HCM",
    date: "05/05/2025",
    category: "Thị trường",
    image: "/assets/project/z7579009684644_5ab37388f9c9c255ade0123dc41546ac.jpg",
  },
  {
    id: "3",
    title: "Những điều cần biết khi ký gửi bất động sản với đơn vị môi giới",
    date: "02/05/2025",
    category: "Kiến thức",
    image: "/assets/project/z7579009853145_59f5e62df9e5574d59f3b3c3ccf7c38f.jpg",
  },
  {
    id: "4",
    title: "Hạ tầng metro số 2 hoàn thành: Cú hích lớn cho BĐS vùng ven",
    date: "28/04/2025",
    category: "Hạ tầng",
    image: "/assets/project/z7579009678830_e298dfef6c11c358f1097c4f444d7405.jpg",
  },
  {
    id: "5",
    title: "Mẹo chọn căn hộ phù hợp cho gia đình trẻ tại TP.HCM",
    date: "25/04/2025",
    category: "Kiến thức",
    image: "/assets/project/z7579009884703_4f20d6e95f4a792809199ee328fce11d.jpg",
  },
];

const categoryColors: Record<string, string> = {
  "Thị trường": "bg-blue-100 text-blue-700",
  "Tài chính": "bg-green-100 text-green-700",
  "Kiến thức": "bg-purple-100 text-purple-700",
  "Hạ tầng": "bg-orange-100 text-orange-700",
};

export default function NewsSection() {
  return (
    <section className="section-padding bg-gray-bg" id="news">
      <div className="container-site">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="section-label mb-2 block">Blog & Tin tức</span>
            <h2 className="font-heading font-bold text-[#1A1A1A] leading-tight" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
              Tin tức <span className="text-orange">mới nhất</span>
            </h2>
          </div>
          <Link href="/news" className="inline-flex items-center gap-1 text-orange text-sm font-semibold hover:gap-2 transition-all">
            Xem tất cả <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* Layout: Featured left + list right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Featured */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 group"
          >
            <Link href={`/news/${featuredArticle.id}`} className="block">
              <div className="relative rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 h-72 mb-5">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`${categoryColors[featuredArticle.category] ?? "bg-orange text-white"} text-xs font-semibold px-3 py-1.5 rounded-full`}>
                    {featuredArticle.category}
                  </span>
                </div>
              </div>
              <h3 className="font-heading font-bold text-[#1A1A1A] text-xl mb-3 group-hover:text-orange transition-colors leading-snug">
                {featuredArticle.title}
              </h3>
              <p className="text-gray-text text-sm leading-relaxed mb-4 line-clamp-3">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-gray-muted text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {featuredArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {featuredArticle.readTime}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-orange text-sm font-semibold">
                  Đọc tiếp <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Article list */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col divide-y divide-gray-200"
            >
              {articles.map((article, i) => (
                <Link key={article.id} href={`/news/${article.id}`} className="group py-4 first:pt-0 last:pb-0">
                  <div className="flex gap-4 items-start">
                    <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5 ${categoryColors[article.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {article.category}
                      </span>
                      <h4 className="font-heading font-semibold text-[#1A1A1A] text-sm leading-snug group-hover:text-orange transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-1 text-gray-muted text-xs mt-1.5">
                        <Calendar size={10} />
                        {article.date}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
