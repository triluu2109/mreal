/**
 * Supabase Storage provider.
 *
 * Dùng service role key để upload (server-side only).
 * Không bao giờ import file này trong Client Components.
 */
import { createClient } from "@supabase/supabase-js";
import path from "node:path";
import { normalizeStoragePath } from "./resolve-url";
import type { UploadImageInput, WritableStorageProvider } from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "mreal-assets";

type UploadRawObjectInput = {
  path: string;
  body: Buffer;
  contentType: string;
};

type BucketWithMimeTypes = {
  public?: boolean | null;
  allowed_mime_types?: string[] | null;
  file_size_limit?: number | null;
};

/** Tạo service-role client — chỉ dùng server-side */
function getServiceClient() {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export async function uploadRawStorageObject({ path, body, contentType }: UploadRawObjectInput): Promise<string> {
  const storagePath = normalizeStoragePath(path);
  if (!storagePath || storagePath.includes("..")) {
    throw new Error("Invalid upload path");
  }

  const supabase = getServiceClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, body, {
      contentType,
      upsert: true,
      cacheControl: "31536000",
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  return storagePath;
}

export async function ensureBucketAllowsMimeTypes(mimeTypes: string[], minFileSizeLimitBytes?: number): Promise<void> {
  const supabase = getServiceClient();
  const { data, error } = await supabase.storage.getBucket(BUCKET);
  if (error) {
    throw new Error(`Supabase bucket lookup failed: ${error.message}`);
  }

  const bucket = data as BucketWithMimeTypes | null;
  const current = bucket?.allowed_mime_types;

  const hasCompatibleRule = (mimeType: string) => {
    const [family] = mimeType.split("/");
    return !current || current.length === 0 || current.includes(mimeType) || current.includes(`${family}/*`);
  };
  const missing = mimeTypes.filter((mimeType) => !hasCompatibleRule(mimeType));
  const needsFileSizeUpdate = Boolean(
    minFileSizeLimitBytes && bucket?.file_size_limit && bucket.file_size_limit < minFileSizeLimitBytes
  );
  if (missing.length === 0 && !needsFileSizeUpdate) return;

  const { error: updateError } = await supabase.storage.updateBucket(BUCKET, {
    public: bucket?.public ?? true,
    ...(current && current.length > 0 ? { allowedMimeTypes: [...current, ...missing] } : {}),
    ...(needsFileSizeUpdate ? { fileSizeLimit: minFileSizeLimitBytes } : {}),
  });

  if (updateError) {
    throw new Error(`Supabase bucket update failed: ${updateError.message}`);
  }
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
    const cleanName = path.posix.basename(fileName);
    const storagePath = `${cleanDir}/${cleanName}`.replace(/\/+/g, "/").replace(/^\//, "");

    if (!storagePath || storagePath.includes("..")) {
      throw new Error("Invalid upload path");
    }

    const input = Buffer.from(await file.arrayBuffer());

    const supabase = getServiceClient();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, input, {
        contentType: file.type,
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
