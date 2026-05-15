import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
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
    const cleanName = `${fileName.replace(/\.webp$/i, "")}.webp`;
    const relativePath = `${cleanDir}/${cleanName}`.replace(/\/+/g, "/").replace(/^\//, "");
    const outputPath = path.join(STORAGE_DIR, ...relativePath.split("/"));

    // Bảo vệ: đảm bảo output nằm trong STORAGE_DIR
    if (!outputPath.startsWith(STORAGE_DIR)) {
      throw new Error("Invalid upload path: outside storage root");
    }

    await mkdir(path.dirname(outputPath), { recursive: true });

    const input = Buffer.from(await file.arrayBuffer());
    const output = await sharp(input).webp({ quality: 82 }).toBuffer();
    await writeFile(outputPath, output);

    return relativePath;
  },
};
