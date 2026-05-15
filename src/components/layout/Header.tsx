"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Mail, MapPin, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { siteImages } from "@/config/images";
import { getImageUrl } from "@/lib/image";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  {
    href: "#",
    label: "Giới thiệu",
    children: [
      { href: "/du-an", label: "Dự án" },
      { href: "/gioi-thieu", label: "Về chúng tôi" },
    ],
  },
  {
    href: "#",
    label: "Giỏ hàng",
    children: [
      { href: "/mua-nha", label: "Mua bán" },
      { href: "/thue-nha", label: "Cho thuê" },
    ],
  },
  { href: "/news", label: "Tin Tức" },
  { href: "/contact", label: "Liên Hệ" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top Bar — Dark Navy */}
      <div className="hidden bg-[#0F1E4A] text-xs text-white lg:block">
        <div className="container-site flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 hover:text-gold transition-colors font-medium">
              <Phone size={11} className="text-gold" />
              <span>Hotline: <strong>{siteConfig.phoneDisplay}</strong></span>
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 hover:text-gold transition-colors">
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
            <Link
              href="/ky-gui"
              className="flex items-center gap-1 bg-gold text-white px-3 py-1 rounded text-xs font-semibold hover:bg-gold-dark transition-colors"
            >
              Gửi bán &amp; Cho thuê
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
          isScrolled ? "shadow-md" : "border-b border-gray-100"
        )}
      >
        <div className="container-site flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <Image
              src={getImageUrl(siteImages.logo.rectangle)}
              alt="M-Real Estate"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-[#1C1C2E] hover:text-gold transition-colors text-sm font-medium font-heading whitespace-nowrap">
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
                        className="absolute top-full left-0 bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[180px] z-50"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-[#333] hover:text-gold hover:bg-gold/5 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-[#1C1C2E] hover:text-gold transition-colors text-sm font-medium font-heading whitespace-nowrap"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#555]"
              aria-label="Tìm kiếm"
            >
              <Search size={18} />
            </button>
            {/* CTA */}
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-2 bg-gold text-white px-4 py-2 rounded-lg text-sm font-semibold font-heading hover:bg-gold-dark transition-colors"
            >
              <Phone size={14} />
              {siteConfig.phoneDisplay}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-[#1A1A1A] p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Search bar overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 overflow-hidden"
            >
              <div className="container-site py-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                  <Search size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bất động sản..."
                    className="flex-1 bg-transparent outline-none text-sm text-[#333] placeholder-gray-400"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-gray-400 hover:text-[#333] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="container-site py-4 flex flex-col gap-1">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                        className="w-full flex items-center justify-between text-[#333] hover:text-navy hover:bg-navy/5 px-4 py-3 rounded-lg transition-colors font-medium text-sm"
                      >
                        {link.label}
                        <ChevronDown size={14} className={cn("transition-transform", mobileExpanded === link.label && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4"
                          >
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-[#555] hover:text-navy px-4 py-2.5 rounded-lg transition-colors text-sm"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-[#333] hover:text-navy hover:bg-navy/5 px-4 py-3 rounded-lg transition-colors font-medium text-sm"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <div className="pt-3 border-t border-gray-100 mt-2">
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-semibold w-full"
                  >
                    <Phone size={16} />
                    Gọi: {siteConfig.phoneDisplay}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
