"use client";

import { motion } from "framer-motion";
import { BarChart2, Lightbulb, Diamond } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";


export default function VisionMissionSection() {
  const { dict: vi } = useI18n();
  const cards = [
    {
      icon: BarChart2,
      title: vi.home.vision.cards[0].title,
      content: vi.home.vision.cards[0].content,
    },
    {
      icon: Lightbulb,
      title: vi.home.vision.cards[1].title,
      content: vi.home.vision.cards[1].content,
    },
    {
      icon: Diamond,
      title: vi.home.vision.cards[2].title,
      content: vi.home.vision.cards[2].content,
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden" id="vision">
      {/* Gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A37A12] via-[#C9971D] to-[#DDB840]" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Skyline silhouette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 144'%3E%3Cpath fill='%23ffffff' d='M0,144 L0,90 L40,90 L40,60 L60,60 L60,40 L80,40 L80,60 L100,60 L100,80 L120,80 L120,40 L130,40 L130,20 L140,20 L140,40 L150,40 L150,80 L180,80 L180,50 L200,50 L200,80 L220,80 L220,30 L240,30 L240,10 L260,10 L260,30 L280,30 L280,80 L300,80 L300,60 L320,60 L320,40 L340,40 L340,60 L360,60 L360,80 L400,80 L400,50 L420,50 L420,20 L440,20 L440,50 L460,50 L460,80 L480,80 L480,60 L500,60 L500,40 L520,40 L520,60 L540,60 L540,80 L560,80 L560,50 L580,50 L580,80 L600,80 L600,30 L620,30 L620,10 L640,10 L640,30 L660,30 L660,80 L680,80 L680,60 L700,60 L700,40 L720,40 L720,60 L740,60 L740,80 L760,80 L760,50 L780,50 L780,80 L800,80 L800,40 L820,40 L820,20 L840,20 L840,40 L860,40 L860,80 L880,80 L880,60 L900,60 L900,80 L920,80 L920,50 L940,50 L940,30 L960,30 L960,50 L980,50 L980,80 L1000,80 L1000,60 L1020,60 L1020,40 L1040,40 L1040,60 L1060,60 L1060,80 L1080,80 L1080,50 L1100,50 L1100,80 L1120,80 L1120,30 L1140,30 L1140,10 L1160,10 L1160,30 L1180,30 L1180,80 L1200,80 L1200,60 L1220,60 L1220,40 L1240,40 L1240,60 L1260,60 L1260,80 L1280,80 L1280,50 L1300,50 L1300,80 L1320,80 L1320,40 L1340,40 L1340,20 L1360,20 L1360,40 L1380,40 L1380,80 L1400,80 L1400,90 L1440,90 L1440,144 Z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      />

      <div className="relative z-10 container-site">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-white/25 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {vi.home.vision.label}
          </span>
          <h2 className="font-heading font-bold text-white mb-3" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
            {vi.home.vision.title}
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm">
            {vi.home.vision.desc}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-white/15 hover:bg-white/25 border border-white/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-white/25 rounded-xl flex items-center justify-center mb-5 group-hover:bg-white/35 transition-colors">
                <card.icon size={26} className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-white text-xl mb-4">{card.title}</h3>
              <p className="text-white/85 text-sm leading-relaxed">{card.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
