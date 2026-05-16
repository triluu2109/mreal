import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram, Twitter, Linkedin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { siteImages } from "@/config/images";
import vi from "@/locales/vi.json";

const navCol1 = [
  { label: vi.footer.columns.col1.links[0].label, href: vi.footer.columns.col1.links[0].href },
  { label: vi.footer.columns.col1.links[1].label, href: vi.footer.columns.col1.links[1].href },
  { label: vi.footer.columns.col1.links[2].label, href: vi.footer.columns.col1.links[2].href },
  { label: vi.footer.columns.col1.links[3].label, href: vi.footer.columns.col1.links[3].href },
];

const navCol2 = [
  { label: vi.footer.columns.col2.links[0].label, href: vi.footer.columns.col2.links[0].href },
  { label: vi.footer.columns.col2.links[1].label, href: vi.footer.columns.col2.links[1].href },
  { label: vi.footer.columns.col2.links[2].label, href: vi.footer.columns.col2.links[2].href },
  { label: vi.footer.columns.col2.links[3].label, href: vi.footer.columns.col2.links[3].href },
];

const navCol3 = [
  { label: vi.footer.columns.col3.links[0].label, href: vi.footer.columns.col3.links[0].href },
  { label: vi.footer.columns.col3.links[1].label, href: vi.footer.columns.col3.links[1].href },
  { label: vi.footer.columns.col3.links[2].label, href: vi.footer.columns.col3.links[2].href },
];

// Địa chỉ động từ config
const MAIN_ADDRESS = siteConfig.address;
const GOOGLE_MAPS_EMBED = siteConfig.mapsEmbedUrl;

export default function Footer() {
  return (
    <footer className="bg-[#1C1C2E] text-white">
      {/* CTA Banner */}
      <div className="bg-navy py-12">
        <div className="container-site text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
            {vi.footer.cta.title}
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            {vi.footer.cta.desc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 bg-white text-navy font-heading font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
            >
              <Phone size={16} />
              <span>Gọi: {siteConfig.phoneDisplay}</span>
            </a>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 bg-gold border-2 border-gold text-white font-heading font-semibold px-8 py-3 rounded-lg hover:bg-gold-dark transition-colors"
            >
              {vi.common.book_appointment}
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand + description */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              {/* BW logo for dark footer — filter makes it fully white */}
              <Image
                src={siteImages.logo.rectangleBw}
                alt="M-Real Estate"
                width={180}
                height={54}
                className="h-14 w-auto object-contain"
                style={{ filter: "invert(1)", mixBlendMode: "screen", width: "auto" }}
                priority
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-sm">
              {vi.footer.company_desc}
            </p>
            {/* Social links */}
            <div className="flex gap-2.5">
              {[
                { href: siteConfig.social.facebook, icon: Facebook, label: "Facebook" },
                { href: siteConfig.social.instagram, icon: Instagram, label: "Instagram" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gold transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column: Giới thiệu */}
          <div>
            <h3 className="font-heading font-semibold text-xs uppercase tracking-widest text-gold mb-4">
              {vi.footer.columns.col1.title}
            </h3>
            <ul className="space-y-2.5">
              {navCol1.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Hỗ trợ */}
          <div>
            <h3 className="font-heading font-semibold text-xs uppercase tracking-widest text-gold mb-4">
              {vi.footer.columns.col2.title}
            </h3>
            <ul className="space-y-2.5">
              {navCol2.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Sản phẩm */}
          <div>
            <h3 className="font-heading font-semibold text-xs uppercase tracking-widest text-gold mb-4">
              {vi.footer.columns.col3.title}
            </h3>
            <ul className="space-y-2.5">
              {navCol3.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Office + Map */}
        <div className="mt-12 pt-10 border-t border-white/10">
          <h3 className="font-heading font-semibold text-xs uppercase tracking-widest text-gold mb-6">
            {vi.footer.office.title}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Address info */}
            <div className="space-y-5">
              <div className="bg-white/5 rounded-xl p-5">
                <h4 className="font-heading font-semibold text-white text-sm mb-3">Văn phòng</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5 text-white/60 text-xs">
                    <MapPin size={13} className="text-gold flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{MAIN_ADDRESS}</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs">
                    <Phone size={13} className="text-gold flex-shrink-0" />
                    <a href={`tel:${siteConfig.phone}`} className="text-white/60 hover:text-gold transition-colors">
                      {siteConfig.phoneDisplay}
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs">
                    <Mail size={13} className="text-gold flex-shrink-0" />
                    <a href={`mailto:${siteConfig.email}`} className="text-white/60 hover:text-gold transition-colors">
                      {siteConfig.email}
                    </a>
                  </li>
                </ul>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAIN_ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold/20 hover:bg-gold text-gold hover:text-white border border-gold/40 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                <MapPin size={13} />
                Xem trên Google Maps
              </a>
            </div>

            {/* Google Maps embed */}
            <div className="rounded-xl overflow-hidden border border-white/10 h-56">
              <iframe
                src={GOOGLE_MAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vị trí văn phòng M-Real Estate"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-white/40 text-xs">
          <p>{vi.common.copyright.replace("{year}", new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  );
}
