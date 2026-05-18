import { normalizeStoragePath } from "@/server/storage/resolve-url";

export const LISTING_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"] as const;
export const LISTING_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

const IMAGE_EXTENSION_SET = new Set<string>(LISTING_IMAGE_EXTENSIONS);
const IMAGE_MIME_SET = new Set<string>(LISTING_IMAGE_MIME_TYPES);

export function mediaExtension(mediaPath: string) {
  let candidate = mediaPath.trim();

  try {
    candidate = new URL(candidate).pathname;
  } catch {
    candidate = candidate.split("?")[0]?.split("#")[0] ?? "";
  }

  const cleanCandidate = candidate.toLowerCase();
  const slashIndex = cleanCandidate.lastIndexOf("/");
  const fileName = slashIndex >= 0 ? cleanCandidate.slice(slashIndex + 1) : cleanCandidate;
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex) : "";
}

export function isListingImagePath(mediaPath: string | null | undefined) {
  if (!mediaPath) return false;
  return IMAGE_EXTENSION_SET.has(mediaExtension(mediaPath));
}

export function isListingImageFile(file: File) {
  return IMAGE_MIME_SET.has(file.type) && isListingImagePath(file.name);
}

export function normalizeListingImagePaths(paths: string[] | undefined | null): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const rawPath of paths ?? []) {
    const cleanPath = normalizeStoragePath(rawPath);
    if (!cleanPath || !isListingImagePath(cleanPath) || seen.has(cleanPath)) continue;
    seen.add(cleanPath);
    normalized.push(cleanPath);
  }

  return normalized;
}

export function nextListingImageIndex(paths: string[] | undefined | null) {
  const indexes = normalizeListingImagePaths(paths)
    .map((mediaPath) => {
      const normalized = normalizeStoragePath(mediaPath);
      const slashIndex = normalized.lastIndexOf("/");
      const fileName = slashIndex >= 0 ? normalized.slice(slashIndex + 1) : normalized;
      const extension = mediaExtension(fileName);
      const basename = extension ? fileName.slice(0, -extension.length) : fileName;
      return /^\d+$/.test(basename) ? Number(basename) : 0;
    });

  return Math.max(0, ...indexes) + 1;
}
