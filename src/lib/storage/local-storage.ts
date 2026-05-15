import type { StorageProvider } from "./types";

const PUBLIC_IMAGE_ROOT = "/images";

export const localStorageProvider: StorageProvider = {
  normalizePath(path) {
    return normalizeLocalPath(path);
  },

  getPublicUrl(path) {
    const normalized = normalizeLocalPath(path);
    return normalized || "";
  },
};

export function normalizeLocalPath(path: string) {
  const value = path.trim();
  if (!value) return "";

  let pathname = value.replace(/\\/g, "/");

  try {
    pathname = new URL(pathname).pathname;
  } catch {
    // Local relative paths are expected and do not parse as URLs.
  }

  pathname = decodeURI(pathname)
    .replace(/^\/?public\//, "/")
    .replace(/^\/?assets\//, `${PUBLIC_IMAGE_ROOT}/`)
    .replace(/^\/?cart\//, `${PUBLIC_IMAGE_ROOT}/listings/`)
    .replace(/^\/+/, "/");

  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  return pathname.replace(/\/{2,}/g, "/");
}
