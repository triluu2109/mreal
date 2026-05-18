import path from "node:path";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { normalizeStoragePath } from "./resolve-url";
import type { UploadImageInput, WritableStorageProvider } from "./types";

/** Root thư mục storage vật lý (ngoài public/) */
const STORAGE_DIR = path.join(process.cwd(), "storage");

export const localWritableProvider: WritableStorageProvider = {
  normalizePath: normalizeStoragePath,

  getPublicUrl(relativePath: string): string {
    const root = process.env.STORAGE_ROOT ?? "/storage";
    const p = normalizeStoragePath(relativePath);
    return p ? `${root}/${p}` : "";
  },

  async uploadImage({ file, directory, fileName }: UploadImageInput): Promise<string> {
    const cleanDir = normalizeStoragePath(directory);
    const cleanName = path.posix.basename(fileName);
    const relativePath = `${cleanDir}/${cleanName}`.replace(/\/+/g, "/").replace(/^\//, "");
    const outputPath = path.join(STORAGE_DIR, ...relativePath.split("/"));

    // Bảo vệ: đảm bảo output nằm trong STORAGE_DIR
    if (!outputPath.startsWith(STORAGE_DIR)) {
      throw new Error("Invalid upload path: outside storage root");
    }

    await mkdir(path.dirname(outputPath), { recursive: true });

    const input = Buffer.from(await file.arrayBuffer());
    await writeFile(outputPath, input);

    return relativePath;
  },

  async deleteFile(relativePath: string): Promise<void> {
    const cleanPath = normalizeStoragePath(relativePath);
    if (!cleanPath) return;

    const outputPath = path.join(STORAGE_DIR, ...cleanPath.split("/"));
    if (!outputPath.startsWith(STORAGE_DIR)) {
      throw new Error("Invalid delete path: outside storage root");
    }

    await rm(outputPath, { force: true });
  },
};
