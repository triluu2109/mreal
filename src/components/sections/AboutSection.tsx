"use client";

import Image from "next/image";
import { siteImages } from "@/config/images";
import { getImageUrl } from "@/lib/image";

const q7Images = siteImages.project.q7SaigonRiverside;
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="section-padding bg-white" id="about">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src={getImageUrl(q7Images.gallery[0])}
                alt="M-Real Estate - Van phong"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating mini card */}
            <div className="absolute -bottom-6 -right-6 bg-gold text-white rounded-xl shadow-lg p-5 hidden md:block">
              <div className="font-heading font-extrabold text-3xl">7+</div>
              <div className="text-sm font-medium text-white/90 mt-1">Năm kinh nghiệm</div>
            </div>
            {/* Small accent image */}
            <div className="absolute -top-4 -left-4 w-28 h-28 rounded-xl overflow-hidden border-4 border-white shadow-lg hidden md:block">
              <Image
                src={getImageUrl(q7Images.gallery[1])}
                alt="Du an"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="section-label mb-3 block">Ve chung toi</span>
            <h2
              className="font-heading font-bold text-[#1C1C2E] mb-5 leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              {"GI\u1edaI THI\u1ec6U V\u1ec0 "}
              <span className="text-navy">M-REAL ESTATE</span>
            </h2>

            <div className="w-12 h-1 bg-gold rounded mb-6" />

            <div className="space-y-4 text-gray-text leading-relaxed text-[15px]">
              <p>
                <strong className="text-[#1C1C2E]">M-Real Estate</strong>{" "}
                {"th\u00e0nh l\u1eadp n\u0103m 2018, chuy\u00ean kinh doanh b\u1ea5t \u0111\u1ed9ng s\u1ea3n t\u1ea1i TP.H\u1ed3 Ch\u00ed Minh v\u00e0 B\u00ecnh D\u01b0\u01a1ng. V\u1edbi h\u01a1n 7 n\u0103m kinh nghi\u1ec7m trong l\u0129nh v\u1ef1c b\u1ea5t \u0111\u1ed9ng s\u1ea3n, ch\u00fang t\u00f4i \u0111\u00e3 x\u00e2y d\u1ef1ng \u0111\u01b0\u1ee3c uy t\u00edn v\u1eefng ch\u1eafc v\u00e0 s\u1ef1 tin t\u01b0\u1edfng t\u1eeb h\u00e0ng ngh\u00ecn kh\u00e1ch h\u00e0ng."}
              </p>
              <p>
                {"D\u1ed9i ng\u0169 c\u1ee7a ch\u00fang t\u00f4i g\u1ed3m c\u00e1c chuy\u00ean vi\u00ean gi\u00e0u kinh nghi\u1ec7m, am hi\u1ec3u th\u1ecb tr\u01b0\u1eddng b\u1ea5t \u0111\u1ed9ng s\u1ea3n TP.HCM v\u00e0 khu v\u1ef1c l\u00e2n c\u1eadn, lu\u00f4n s\u1eb5n s\u00e0ng t\u01b0 v\u1ea5n v\u00e0 h\u1ed7 tr\u1ee3 kh\u00e1ch h\u00e0ng t\u00ecm ki\u1ebfm b\u1ea5t \u0111\u1ed9ng s\u1ea3n ph\u00f9 h\u1ee3p nh\u1ea5t."}
              </p>
              <p>
                {"Ch\u00fang t\u00f4i cung c\u1ea5p \u0111a d\u1ea1ng c\u00e1c d\u1ecbch v\u1ee5: mua b\u00e1n, cho thu\u00ea, k\u00fd g\u1eedi b\u1ea5t \u0111\u1ed9ng s\u1ea3n v\u00e0 t\u01b0 v\u1ea5n \u0111\u1ea7u t\u01b0 \u2014 v\u1edbi cam k\u1ebft minh b\u1ea1ch, nhanh ch\u00f3ng v\u00e0 hi\u1ec7u qu\u1ea3."}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 py-6 border-t border-b border-gray-100">
              {[
                { value: "1000+", label: "Giao dich thanh cong" },
                { value: "7+", label: "Nam kinh nghiem" },
                { value: "98%", label: "Khach hang hai long" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-heading font-extrabold text-2xl text-gold">{stat.value}</div>
                  <div className="text-gray-text text-xs mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <Link
                href="/gioi-thieu"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-heading font-semibold px-7 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-sm shadow-gold"
              >
                Xem them
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
