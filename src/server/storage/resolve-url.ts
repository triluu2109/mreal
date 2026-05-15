import { storageConfig } from "./config";

/**
 * Convert một relative storage path thành URL công khai.
 *
 * Database chỉ lưu relative path, ví dụ:
 *   "listings/rent/RENT-001/cover.webp"
 *   "news/co-nen-thue-can-ho-q7/thumbnail.webp"
 *
 * Local provider trả về:
 *   "/storage/listings/rent/RENT-001/cover.webp"
 *
 * Khi đổi sang Supabase Storage / S3, chỉ cần đổi STORAGE_PROVIDER
 * và hàm này sẽ trả về URL tương ứng.
 *
 * TUYỆT ĐỐI không nối chuỗi storage URL trực tiếp trong component.
 * Luôn dùng hàm này.
 */
export function resolveStorageUrl(relativePath: string | null | undefined): string {
  if (!relativePath) return "";

  // Nếu là URL đầy đủ (http/https), trả nguyên (legacy data)
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }

  const path = normalizePath(relativePath);
  if (!path) return "";

  switch (storageConfig.provider) {
    case "local":
      return `${storageConfig.localRoot}/${path}`;
    // Thêm case "s3" / "supabase" khi cần
    default:
      return `${storageConfig.localRoot}/${path}`;
  }
}

/**
 * Normalize một input path (có thể có prefix cũ) thành relative path sạch.
 * Dùng khi cần lưu vào database.
 *
 * Ví dụ:
 *   "/storage/listings/rent/x/main.webp"  → "listings/rent/x/main.webp"
 *   "/images/listings/rent/x/main.webp"   → "listings/rent/x/main.webp"
 *   "listings/rent/x/main.webp"           → "listings/rent/x/main.webp"
 */
export function normalizeStoragePath(path: string | null | undefined): string {
  if (!path) return "";

  let p = path.trim().replace(/\\/g, "/");

  // Strip domain nếu có
  try {
    const url = new URL(p);
    p = url.pathname;
  } catch {
    // Không phải URL đầy đủ — giữ nguyên
  }

  // Bỏ các prefix cũ
  p = p
    .replace(/^\/storage\//, "")
    .replace(/^\/images\/listings\//, "listings/")
    .replace(/^\/images\/news\//, "news/")
    .replace(/^\/images\//, "")
    .replace(/^\/public\//, "")
    .replace(/^\/+/, "");

  return p;
}

/** Alias cho backward compat */
export function normalizePath(path: string): string {
  return normalizeStoragePath(path);
}
