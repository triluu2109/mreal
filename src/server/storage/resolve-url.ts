const SUPABASE_STORAGE_PUBLIC_SEGMENT = "/storage/v1/object/public/";
const DEFAULT_PUBLIC_STORAGE_BUCKET = "mreal-assets";

/**
 * Convert a dynamic storage path into the canonical public image URL.
 *
 * Dynamic content must render as a Supabase public Storage URL on both SSR and
 * CSR so React never sees a different src/srcSet during hydration. Branding
 * assets are local public files and should use /logo/* or /favicon.ico directly.
 */
export function resolveStorageUrl(relativePath: string | null | undefined): string {
  if (!relativePath) return "";

  const path = normalizePath(relativePath);
  if (!path) return "";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "") ?? "";
  if (!supabaseUrl) return "";

  return `${supabaseUrl}${SUPABASE_STORAGE_PUBLIC_SEGMENT}${getPublicStorageBucket()}/${path}`;
}

/**
 * Normalize any legacy image input into a bucket-relative path for persistence.
 *
 * Examples:
 * - https://x.supabase.co/storage/v1/object/public/mreal-assets/a.webp -> a.webp
 * - /storage/listings/rent/x/main.webp -> listings/rent/x/main.webp
 * - /images/projects/q7/a.webp -> projects/q7/a.webp
 * - listings/rent/x/main.webp -> listings/rent/x/main.webp
 */
export function normalizeStoragePath(path: string | null | undefined): string {
  if (!path) return "";

  let p = path.trim().replace(/\\/g, "/");
  if (!p) return "";

  try {
    const url = new URL(p);
    p = url.pathname;
  } catch {
    // Not an absolute URL.
  }

  const publicStorageIndex = p.indexOf(SUPABASE_STORAGE_PUBLIC_SEGMENT);
  if (publicStorageIndex >= 0) {
    p = p.slice(publicStorageIndex + SUPABASE_STORAGE_PUBLIC_SEGMENT.length);
    const bucket = getPublicStorageBucket();
    if (p === bucket) return "";
    if (p.startsWith(`${bucket}/`)) p = p.slice(bucket.length + 1);
  }

  p = p
    .replace(/^\/storage\//, "")
    .replace(/^\/images\/listings\//, "listings/")
    .replace(/^\/images\/news\//, "news/")
    .replace(/^\/images\/projects\//, "projects/")
    .replace(/^\/images\//, "")
    .replace(/^\/public\//, "")
    .replace(/^\/+/, "");

  return p;
}

/** Backward-compatible alias. */
export function normalizePath(path: string): string {
  return normalizeStoragePath(path);
}

function getPublicStorageBucket() {
  return process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? DEFAULT_PUBLIC_STORAGE_BUCKET;
}
