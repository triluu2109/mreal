/**
 * Storage configuration.
 * STORAGE_PROVIDER: "local" (default) | "s3" | "supabase"
 * STORAGE_ROOT: URL prefix for local provider, e.g. "/storage"
 */
export const storageConfig = {
  provider: (process.env.STORAGE_PROVIDER ?? "local") as "local" | "s3" | "supabase",
  /** Root URL prefix used when building public URLs for local storage */
  localRoot: process.env.STORAGE_ROOT ?? "/storage",
} as const;
