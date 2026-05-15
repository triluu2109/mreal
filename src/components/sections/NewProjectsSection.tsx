"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, ChevronRight, ArrowRight } from "lucide-react";
import { siteImages } from "@/config/images";
import { getImageUrl } from "@/lib/image";

const q7Images = siteImages.project.q7SaigonRiverside;

const projects = [
  {
    id: "q7-saigon-riverside-complex",
    name: "Q7 SAIGON RIVERSIDE COMPLEX",
    developer: "Hưng Thịnh Corp",
    status: "Đang mở bán",
    statusColor: "bg-gold",
    location: "Đường Đào Trí, Phường Phú Thuận, TP.HCM",
    startDate: "Bàn giao 2024",
    priceFrom: "Từ 2.1 tỷ",
    image: q7Images.hero.overview,
    featured: true,
    tag: "Dự án nổi bật",
  },
  {
    id: "2",
    name: "Victoria Village",
    developer: "Novaland Group",
    status: "Đang xây dựng",
    statusColor: "bg-orange",
    location: "Quận 2, TP.HCM",
    startDate: "Q2/2026",
    priceFrom: "Từ 55 triệu/m²",
    image: q7Images.gallery[4],
    featured: false,
    tag: "Mới ra mắt",
  },
  {
    id: "3",
    name: "The Emerald Garden View",
    developer: "BIM Group",
    status: "Đang xây dựng",
    statusColor: "bg-orange",
    location: "Thủ Đức, TP.HCM",
    startDate: "Q1/2026",
    priceFrom: "Từ 48 triệu/m²",
    image: q7Images.gallery[2],
    featured: false,
    tag: "Hot",
  },
];

export default function NewProjectsSection() {
  return (
    <section className="section-padding bg-white" id="projects">
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
            <span className="section-label mb-2 block">Bất động sản</span>
            <h2 className="font-heading font-bold text-[#1A1A1A] leading-tight" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
              Dự án <span className="text-orange">mới</span>
            </h2>
          </div>
          <Link href="/du-an" className="inline-flex items-center gap-1 text-orange text-sm font-semibold hover:gap-2 transition-all">
            Xem tất cả <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* Layout: Featured left + 2 cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured project */}
          {projects
            .filter((p) => p.featured)
            .map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3 group"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 h-full min-h-[400px]">
                  <Image
                    src={getImageUrl(project.image)}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {project.tag}
                    </span>
                  </div>
                  {/* Status */}
                  <div className="absolute top-4 right-4">
                    <span className={`${project.statusColor} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}>
                      {project.status}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading font-bold text-white text-xl md:text-2xl mb-2">
                      {project.name}
                    </h3>
                    <p className="text-orange text-sm font-medium mb-1">{project.developer}</p>
                    <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-orange" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-orange" />
                        {project.startDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-heading font-semibold">{project.priceFrom}</span>
                      <Link
                        href={`/du-an/${project.id}`}
                        className="inline-flex items-center gap-2 bg-orange text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-dark transition-colors"
                      >
                        Xem chi tiết
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

          {/* Right side cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {projects
              .filter((p) => !p.featured)
              .map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 flex flex-col sm:flex-row lg:flex-col">
                    {/* Image */}
                    <div className="relative h-44 sm:w-40 sm:h-auto lg:w-full lg:h-44 flex-shrink-0 overflow-hidden">
                      <Image
                        src={getImageUrl(project.image)}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-orange text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                          {project.tag}
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-4 flex-1">
                      <span className={`${project.statusColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                        {project.status}
                      </span>
                      <h3 className="font-heading font-bold text-[#1A1A1A] text-base mt-2 mb-1 group-hover:text-orange transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-text text-xs mb-1">
                        <MapPin size={11} className="text-orange" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-orange font-heading font-semibold text-sm">{project.priceFrom}</span>
                        <Link
                          href={`/du-an/${project.id}`}
                          className="text-xs text-orange font-semibold hover:underline flex items-center gap-1"
                        >
                          Chi tiết <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
