import { storageConfig } from "./config";
import { localWritableProvider } from "./upload";
import type { WritableStorageProvider } from "./types";

/**
 * Provider ghi (upload) cho storage — authoritative module.
 *
 * Switch dựa theo STORAGE_PROVIDER env:
 *   "supabase" → supabaseWritableProvider (production)
 *   "local"    → localWritableProvider (development / fallback)
 *
 * Chỉ import trong Server Components, Server Actions, API Routes.
 * KHÔNG import trong Client Components.
 */
export const writableStorageProvider: WritableStorageProvider = (() => {
  switch (storageConfig.provider) {
    case "supabase": {
      // Dynamic require để tránh bundle vào client
      const { supabaseWritableProvider } = require("./supabase-provider") as {
        supabaseWritableProvider: WritableStorageProvider;
      };
      return supabaseWritableProvider;
    }
    case "local":
    default:
      return localWritableProvider;
  }
})();

/**
 * Provider chỉ đọc (resolve URL).
 * An toàn để import trong Server Components.
 */
export { resolveStorageUrl, normalizeStoragePath } from "./resolve-url";
