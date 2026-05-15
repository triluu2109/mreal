/**
 * Cấu hình động của M-Real Estate.
 * Đọc từ biến môi trường NEXT_PUBLIC_* với giá trị mặc định dự phòng.
 * Để thay đổi: cập nhật .env rồi restart dev server.
 */
export const siteConfig = {
  phone: process.env.NEXT_PUBLIC_PHONE ?? "0939720039",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "0939.720.039",
  zalo: process.env.NEXT_PUBLIC_ZALO_PHONE ?? "0939720039",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "info@mrealestate.vn",
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "D27 Đường số 5, KDC Sài Gòn Chợ Lớn, Phường Tân Mỹ, TP.HCM",
  mapsEmbedUrl:
    process.env.NEXT_PUBLIC_MAPS_EMBED_URL ??
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0!2d106.6353!3d10.7273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f28906b023f%3A0x75f6c77d7a0cbd5b!2sKDC%20S%C3%A0i%20G%C3%B2n%20Ch%E1%BB%A3%20L%E1%BB%9Bn!5e0!3m2!1svi!2svn!4v1715434000000!5m2!1svi!2svn",
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK ?? "https://facebook.com/mrealestate",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "https://instagram.com/mrealestate",
    twitter: process.env.NEXT_PUBLIC_TWITTER ?? "https://twitter.com/mrealestate",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN ?? "https://linkedin.com/company/mrealestate",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE ?? "https://youtube.com/@mrealestate",
    zaloLink: process.env.NEXT_PUBLIC_ZALO_LINK ?? `https://zalo.me/${process.env.NEXT_PUBLIC_ZALO_PHONE ?? "0939720039"}`,
    messenger: process.env.NEXT_PUBLIC_MESSENGER ?? "https://m.me/duchunggroup",
  },
} as const;
