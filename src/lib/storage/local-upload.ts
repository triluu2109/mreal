import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { localStorageProvider } from "./local-storage";
import type { UploadImageInput, WritableStorageProvider } from "./types";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export const localWritableStorageProvider: WritableStorageProvider = {
  ...localStorageProvider,

  async uploadImage({ file, directory, fileName }: UploadImageInput) {
    const normalizedDirectory = localStorageProvider
      .normalizePath(directory)
      .replace(/^\/images\/?/, "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");
    const normalizedFileName = `${fileName.replace(/\.webp$/i, "")}.webp`;
    const relativePath = path.posix.join("images", normalizedDirectory, normalizedFileName);
    const outputPath = path.join(PUBLIC_DIR, ...relativePath.split("/"));
    const imagesRoot = path.join(PUBLIC_DIR, "images");

    if (!outputPath.startsWith(imagesRoot)) {
      throw new Error("Invalid upload path");
    }

    await mkdir(path.dirname(outputPath), { recursive: true });

    const input = Buffer.from(await file.arrayBuffer());
    const output = await sharp(input).webp({ quality: 82 }).toBuffer();
    await writeFile(outputPath, output);

    return localStorageProvider.normalizePath(`/${relativePath}`);
  },
};
