"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, ChevronRight, ArrowRight, Sparkles, Flame } from "lucide-react";
import { siteImages } from "@/config/images";
import { getImageUrl } from "@/lib/image";
import { useI18n } from "@/components/i18n/I18nProvider";

const q7Images = siteImages.project.q7SaigonRiverside;

export default function NewProjectsSection() {
  const { dict: vi } = useI18n();
  const projects = vi.home.projects.items.map((project) => ({
    id: project.id,
    name: project.name,
    developer: project.developer,
    status: project.status,
    statusColor: "bg-gold",
    location: project.location,
    startDate: project.start_date,
    priceFrom: project.price_from,
    image: q7Images.hero.overview,
    featured: true,
    tag: project.tag,
  }));

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
            <span className="section-label mb-2 block">{vi.home.projects.label}</span>
            <h2 className="font-heading font-bold text-navy leading-tight" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
              {vi.home.projects.title} <span className="text-orange">{vi.home.projects.title_highlight}</span>
            </h2>
          </div>
          <Link href="/du-an" className="inline-flex items-center gap-1 text-orange text-sm font-semibold hover:gap-2 transition-all">
            {vi.common.view_all} <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* Layout: Single beautiful featured project showcase */}
        <div className="max-w-6xl mx-auto">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-500 min-h-[460px] md:min-h-[540px]">
                <Image
                  src={getImageUrl(project.image)}
                  alt={project.name}
                  fill
                  sizes="100vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  priority
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Badges in Top Left */}
                <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                  <span className="bg-orange text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                    <Sparkles size={13} className="text-white animate-pulse" />
                    {project.tag}
                  </span>
                  <span className={`${project.statusColor} text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5`}>
                    <Flame size={13} className="text-white fill-white" />
                    {project.status}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-3xl">
                      <p className="text-orange text-sm md:text-base font-semibold mb-2 tracking-wide uppercase">
                        {project.developer}
                      </p>
                      <h3 className="font-heading font-bold text-white text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight">
                        {project.name}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80 text-sm md:text-base mb-6 border-b border-white/10 pb-6">
                        <span className="flex items-center gap-2">
                          <MapPin size={16} className="text-orange flex-shrink-0" />
                          {project.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar size={16} className="text-orange flex-shrink-0" />
                          {project.startDate}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-white/60 text-xs uppercase tracking-wider mb-1">{vi.home.projects.price_from_label}</span>
                        <span className="text-white font-heading font-bold text-2xl md:text-3xl">{project.priceFrom}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Link
                        href={`/du-an/${project.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-orange text-white text-sm md:text-base font-semibold px-6 py-3.5 rounded-xl hover:bg-orange-dark shadow-lg hover:shadow-orange/20 transition-all duration-300"
                      >
                        {vi.home.projects.view_detail}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
