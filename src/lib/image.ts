/**
 * @deprecated Dùng resolveStorageUrl từ @/server/storage/resolve-url thay thế.
 * File này giữ lại để backward compat với các component cũ đang import.
 */
export { resolveStorageUrl as getImageUrl, normalizeStoragePath as normalizeImagePath } from "@/server/storage/resolve-url";
