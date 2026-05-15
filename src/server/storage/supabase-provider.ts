/**
 * Supabase Storage provider.
 *
 * Dùng service role key để upload (server-side only).
 * Không bao giờ import file này trong Client Components.
 */
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { normalizeStoragePath } from "./resolve-url";
import type { UploadImageInput, WritableStorageProvider } from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "mreal-assets";

/** Tạo service-role client — chỉ dùng server-side */
function getServiceClient() {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export const supabaseWritableProvider: WritableStorageProvider = {
  normalizePath: normalizeStoragePath,

  getPublicUrl(relativePath: string): string {
    if (!relativePath) return "";
    const path = normalizeStoragePath(relativePath);
    if (!path) return "";
    // Full absolute URL pointing to Supabase CDN
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  },

  async uploadImage({ file, directory, fileName }: UploadImageInput): Promise<string> {
    const cleanDir = normalizeStoragePath(directory);
    const cleanName = `${fileName.replace(/\.webp$/i, "")}.webp`;
    const storagePath = `${cleanDir}/${cleanName}`.replace(/\/+/g, "/").replace(/^\//, "");

    if (!storagePath || storagePath.includes("..")) {
      throw new Error("Invalid upload path");
    }

    // Convert to WebP với sharp
    const input = Buffer.from(await file.arrayBuffer());
    const output = await sharp(input).webp({ quality: 82 }).toBuffer();

    const supabase = getServiceClient();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, output, {
        contentType: "image/webp",
        upsert: true,
        cacheControl: "31536000",
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    return storagePath;
  },

  async deleteFile(relativePath: string): Promise<void> {
    const path = normalizeStoragePath(relativePath);
    if (!path) return;
    const supabase = getServiceClient();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      console.error("Supabase delete error:", error.message);
    }
  },
};
