import { storageConfig } from "./config";
import { localWritableProvider } from "./upload";
import type { WritableStorageProvider } from "./types";

/**
 * Provider ghi (upload) cho storage.
 * Chỉ import trong Server Components, Server Actions, API Routes.
 */
export const writableStorageProvider: WritableStorageProvider = (() => {
  switch (storageConfig.provider) {
    case "local":
      return localWritableProvider;
    // Thêm "s3" / "supabase" ở đây khi cần
    default:
      return localWritableProvider;
  }
})();

/**
 * Provider chỉ đọc (resolve URL).
 * An toàn để import trong Server Components.
 */
export { resolveStorageUrl, normalizeStoragePath } from "./resolve-url";
