import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Sắp ra mắt – M-Real Estate",
  description: "Trang này đang được xây dựng. Quay lại sớm để khám phá thêm nhiều nội dung từ M-Real Estate.",
};

export default function ComingSoonPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center bg-gray-bg px-4">
        <div className="max-w-xl w-full text-center py-24">
          {/* Icon */}
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-navy/10 border border-navy/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9 text-navy"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
          </div>

          {/* Eyebrow */}
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
            Đang chuẩn bị
          </p>

          {/* Heading */}
          <h1 className="font-heading text-4xl font-bold text-navy leading-tight mb-5">
            Trang này sắp ra mắt
          </h1>

          {/* Body */}
          <p className="text-gray-text text-base leading-relaxed mb-10 max-w-sm mx-auto">
            Chúng tôi đang hoàn thiện nội dung để mang đến trải nghiệm tốt nhất cho bạn. Trong thời gian chờ đợi, hãy khám phá các trang khác.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gold/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
            <div className="flex-1 h-px bg-gold/20" />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 10V10m-4 2h16" />
              </svg>
              Về trang chủ
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy hover:border-gold hover:text-gold transition-colors"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
