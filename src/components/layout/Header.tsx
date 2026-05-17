"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Mail, MapPin, Menu, Phone, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { siteImages } from "@/config/images";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function Header() {
  const { dict: vi } = useI18n();
  const headerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navLinks = [
    { href: "/", label: vi.nav.home },
    {
      href: "#",
      label: vi.nav.about,
      children: [
        { href: "/du-an", label: vi.nav.projects },
        { href: "/gioi-thieu", label: vi.nav.about_us },
      ],
    },
    {
      href: "#",
      label: vi.nav.listings,
      children: [
        { href: "/gio-hang-ban", label: vi.nav.buy },
        { href: "/gio-hang-thue", label: vi.nav.rent },
      ],
    },
    { href: "/news", label: vi.nav.news },
    { href: "/contact", label: vi.nav.contact },
  ];

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 10);
      setIsHidden(currentY > lastY && currentY > 120 && !mobileOpen);
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => setHeaderHeight(header.offsetHeight);
    updateHeaderHeight();

    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <>
      <div ref={headerRef} className={cn("fixed left-0 right-0 top-0 z-50 bg-white transition-transform duration-300", isHidden ? "-translate-y-full" : "translate-y-0")}>
        <div className="hidden bg-[#0F1E4A] text-xs text-white lg:block">
          <div className="container-site flex items-center justify-between py-2">
            <div className="flex items-center gap-6">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 font-medium transition-colors hover:text-gold">
                <Phone size={11} className="text-gold" />
                <span>{vi.common.hotline} <strong>{siteConfig.phoneDisplay}</strong></span>
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 transition-colors hover:text-gold">
                <Mail size={11} className="text-gold" />
                <span>{siteConfig.email}</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-white/70">
                <MapPin size={11} className="text-gold" />
                <span>{siteConfig.address}</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <Link href="/ky-gui" className="rounded bg-gold px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-gold-dark">
                {vi.common.send_listing}
              </Link>
            </div>
          </div>
        </div>

        <header className={cn("bg-white transition-all duration-300", isScrolled ? "shadow-md" : "border-b border-gray-100")}>
          <div className="relative">
            <div className="container-site flex items-center justify-between gap-4 py-2 lg:py-3">
              <Link href="/" className="flex flex-shrink-0 items-center gap-2">
                <Image
                  src={siteImages.logo.rectangle}
                  alt="M-Real Estate"
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain lg:h-12"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </Link>

              <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label} className="relative" onMouseEnter={() => setActiveDropdown(link.label)} onMouseLeave={() => setActiveDropdown(null)}>
                      <button className="flex items-center gap-1 px-3 py-2 font-heading text-sm font-medium text-[#1C1C2E] transition-colors hover:text-gold">
                        {link.label}
                        <ChevronDown size={13} className={cn("transition-transform", activeDropdown === link.label && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full z-50 min-w-[180px] rounded-lg border border-gray-100 bg-white py-2 shadow-lg"
                          >
                            {link.children.map((child) => (
                              <Link key={child.href} href={child.href} className="block px-4 py-2 text-sm text-[#333] transition-colors hover:bg-gold/5 hover:text-gold">
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link key={link.href} href={link.href} className="px-3 py-2 font-heading text-sm font-medium text-[#1C1C2E] transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  )
                )}
              </nav>

              <div className="hidden flex-shrink-0 items-center gap-2 lg:flex">
                <button onClick={() => setSearchOpen(!searchOpen)} className="rounded-lg p-2 text-[#555] transition-colors hover:bg-gray-100" aria-label={vi.header.search_aria}>
                  <Search size={18} />
                </button>
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 font-heading text-sm font-semibold text-white transition-colors hover:bg-gold-dark">
                  <Phone size={14} />
                  {siteConfig.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <button className="rounded-lg p-2 text-[#1A1A1A] transition-colors hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)} aria-label={vi.header.toggle_menu}>
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-gray-100">
                <div className="container-site py-3">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
                    <Search size={16} className="flex-shrink-0 text-gray-400" />
                    <input type="text" placeholder={vi.header.search_placeholder} className="flex-1 bg-transparent text-sm text-[#333] outline-none placeholder-gray-400" autoFocus />
                    <button onClick={() => setSearchOpen(false)} className="text-gray-400 transition-colors hover:text-[#333]">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-gray-100 bg-white lg:hidden">
                <div className="container-site flex flex-col gap-1 py-3">
                  {navLinks.map((link) =>
                    link.children ? (
                      <div key={link.label}>
                        <button onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)} className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-[#333] transition-colors hover:bg-navy/5 hover:text-navy">
                          {link.label}
                          <ChevronDown size={14} className={cn("transition-transform", mobileExpanded === link.label && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === link.label && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4">
                              {link.children.map((child) => (
                                <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm text-[#555] transition-colors hover:text-navy">
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-[#333] transition-colors hover:bg-navy/5 hover:text-navy">
                        {link.label}
                      </Link>
                    )
                  )}
                  <div className="mt-2 border-t border-gray-100 pt-3">
                    <a href={`tel:${siteConfig.phone}`} className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 font-semibold text-white">
                      <Phone size={16} />
                      {vi.common.call_prefix} {siteConfig.phoneDisplay}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>
      <div
        className="h-[56px] lg:h-[104px]"
        style={headerHeight ? { height: `${headerHeight}px` } : undefined}
        aria-hidden="true"
      />
    </>
  );
}
