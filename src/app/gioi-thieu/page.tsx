import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Award, Users, Home, TrendingUp, Shield, Heart, Star, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Về chúng tôi — M-Real Estate",
  description: "M-Real Estate thành lập năm 2018, chuyên kinh doanh bất động sản tại TP.HCM và Bình Dương. Hơn 7 năm kinh nghiệm, uy tín, chuyên nghiệp.",
};

const stats = [
  { value: "7+", label: "Năm kinh nghiệm", icon: TrendingUp },
  { value: "500+", label: "Căn hộ đã giao dịch", icon: Home },
  { value: "1000+", label: "Khách hàng tin tưởng", icon: Users },
  { value: "98%", label: "Khách hàng hài lòng", icon: Star },
];

const values = [
  { icon: Shield, title: "Uy tín", desc: "Cam kết thông tin minh bạch, pháp lý rõ ràng trong mọi giao dịch." },
  { icon: Heart, title: "Tận tâm", desc: "Đặt lợi ích khách hàng lên hàng đầu, đồng hành xuyên suốt từng bước." },
  { icon: Award, title: "Chuyên nghiệp", desc: "Đội ngũ được đào tạo bài bản, cập nhật thị trường liên tục." },
  { icon: TrendingUp, title: "Minh bạch", desc: "Công khai chi phí, điều khoản, không phát sinh phí ẩn." },
];

const team = [
  { name: "Nguyễn Văn Minh", role: "Giám đốc điều hành", desc: "12 năm kinh nghiệm bất động sản tại TP.HCM", initial: "M" },
  { name: "Trần Thị Lan", role: "Trưởng phòng kinh doanh", desc: "Chuyên gia tư vấn căn hộ cao cấp khu Nam Sài Gòn", initial: "L" },
  { name: "Lê Hoàng Nam", role: "Chuyên viên pháp lý", desc: "Chuyên xử lý hợp đồng, công chứng và thủ tục sang tên", initial: "N" },
  { name: "Phạm Thu Hà", role: "Chuyên viên tư vấn", desc: "Đặc trách khu vực Bình Chánh và dự án Q7 Riverside", initial: "H" },
  { name: "Đỗ Quốc Bảo", role: "Chuyên viên tư vấn", desc: "Tư vấn đầu tư và phân tích thị trường Bình Dương", initial: "B" },
  { name: "Hoàng Mỹ Linh", role: "Chăm sóc khách hàng", desc: "Hỗ trợ sau bán hàng và quản lý mối quan hệ khách hàng", initial: "L" },
];

const milestones = [
  { year: "2018", event: "Thành lập M-Real Estate, tập trung thị trường Bình Chánh – TP.HCM" },
  { year: "2020", event: "Mở rộng sang thị trường Bình Dương và các tỉnh lân cận" },
  { year: "2022", event: "Đạt 300+ giao dịch thành công, nhận chứng nhận đơn vị uy tín" },
  { year: "2024", event: "Hợp tác phân phối dự án Q7 Saigon Riverside Complex" },
  { year: "2025", event: "Ra mắt nền tảng số, phục vụ hơn 1000 khách hàng" },
];

export default function GioiThieuPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── HERO ── */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #C9971D 1px, transparent 1px), radial-gradient(circle at 75% 20%, #C9971D 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
          <div className="relative z-10 container-site text-center">
            <span className="inline-block bg-gold/20 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Về chúng tôi
            </span>
            <h1 className="font-heading font-bold text-white mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              M-REAL ESTATE<br />
              <span className="text-gold">Đồng hành cùng bạn từ năm 2018</span>
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              Chúng tôi là đơn vị môi giới bất động sản uy tín, chuyên cung cấp dịch vụ mua bán,
              cho thuê và tư vấn đầu tư tại TP.HCM và Bình Dương.
            </p>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-12 bg-white">
          <div className="container-site">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-gray-bg hover:shadow-card transition-shadow">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <s.icon size={22} className="text-gold" />
                  </div>
                  <p className="font-heading font-bold text-navy text-3xl mb-1">{s.value}</p>
                  <p className="text-gray-text text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GIỚI THIỆU CÔNG TY ── */}
        <section className="py-16 bg-gray-bg">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-label mb-3 block">Câu chuyện của chúng tôi</span>
                <h2 className="font-heading font-bold text-navy mb-6" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                  Hơn 7 năm <span className="text-gold">kiến tạo giá trị</span>
                </h2>
                <div className="space-y-4 text-gray-text leading-relaxed">
                  <p>
                    M-Real Estate thành lập năm 2018, xuất phát từ niềm đam mê bất động sản và mong
                    muốn mang đến những giao dịch minh bạch, an toàn cho người mua nhà Việt Nam.
                  </p>
                  <p>
                    Với văn phòng chính tại D27 Đường số 5, KDC Sài Gòn Chợ Lớn, Phường Tân Mỹ,
                    TP.HCM — chúng tôi chuyên sâu vào thị trường khu Nam Sài Gòn, đặc biệt là các
                    dự án căn hộ ven sông tại Bình Chánh và Quận 7.
                  </p>
                  <p>
                    Đội ngũ của chúng tôi gồm các chuyên viên được đào tạo bài bản, am hiểu pháp lý
                    và thị trường, luôn đặt lợi ích khách hàng lên hàng đầu.
                  </p>
                </div>
              </div>
              {/* Timeline */}
              <div>
                <h3 className="font-heading font-bold text-navy text-lg mb-6">Hành trình phát triển</h3>
                <div className="relative pl-6 border-l-2 border-gold/30 space-y-6">
                  {milestones.map((m, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[29px] w-4 h-4 bg-gold rounded-full border-2 border-white" />
                      <span className="text-gold font-heading font-bold text-sm">{m.year}</span>
                      <p className="text-gray-text text-sm mt-1 leading-relaxed">{m.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── GIÁ TRỊ CỐT LÕI ── */}
        <section className="py-16 bg-white">
          <div className="container-site">
            <div className="text-center mb-12">
              <span className="section-label mb-3 block">Giá trị cốt lõi</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                Những điều <span className="text-gold">chúng tôi cam kết</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-gray-bg hover:bg-gold hover:shadow-gold transition-all duration-300 hover:-translate-y-1 text-center">
                  <div className="w-14 h-14 bg-gold/10 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors">
                    <v.icon size={26} className="text-gold group-hover:text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-navy group-hover:text-white text-lg mb-3 transition-colors">{v.title}</h3>
                  <p className="text-gray-text group-hover:text-white/80 text-sm leading-relaxed transition-colors">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ĐỘI NGŨ ── */}
        <section className="py-16 bg-gray-bg">
          <div className="container-site">
            <div className="text-center mb-12">
              <span className="section-label mb-3 block">Nhân sự</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                Đội ngũ <span className="text-gold">chuyên nghiệp</span>
              </h2>
              <p className="text-gray-text max-w-xl mx-auto mt-3">
                Mỗi thành viên trong đội ngũ chúng tôi đều được đào tạo chuyên sâu và có nhiều
                năm kinh nghiệm trong lĩnh vực bất động sản.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <div key={i} className="group bg-white rounded-2xl p-6 hover:shadow-hover transition-all duration-300 hover:-translate-y-1 text-center">
                  {/* Avatar placeholder with initials */}
                  <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-gold transition-shadow">
                    <span className="font-heading font-bold text-white text-2xl">{member.initial}</span>
                  </div>
                  <h3 className="font-heading font-bold text-navy text-base mb-1">{member.name}</h3>
                  <p className="text-gold font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-gray-text text-xs leading-relaxed">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LIÊN HỆ CTA ── */}
        <section className="py-16 bg-white">
          <div className="container-site max-w-4xl">
            <div className="bg-gradient-to-r from-gold to-gold-light rounded-3xl p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-3">
                    Cần tư vấn bất động sản?
                  </h2>
                  <p className="text-white/80 mb-4">
                    Liên hệ ngay để được tư vấn miễn phí bởi đội ngũ chuyên viên giàu kinh nghiệm.
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-white/90">
                    <span className="flex items-center gap-2"><Phone size={14}/> 0939.720.039</span>
                    <span className="flex items-center gap-2"><MapPin size={14}/> D27 Đường số 5, KDC Sài Gòn Chợ Lớn, P. Tân Mỹ, TP.HCM</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={`tel:${siteConfig.phone}`} className="flex-1 bg-white text-gold font-heading font-bold px-6 py-4 rounded-xl text-center hover:bg-white/90 transition-colors">
                    Gọi ngay
                  </a>
                  <Link href="/contact" className="flex-1 bg-white/20 text-white font-heading font-bold px-6 py-4 rounded-xl text-center hover:bg-white/30 border border-white/30 transition-colors">
                    Liên hệ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
