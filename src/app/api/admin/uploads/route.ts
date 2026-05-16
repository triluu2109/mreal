import { NextResponse } from "next/server";
import { writableStorageProvider } from "@/server/storage/provider";
import { normalizeStoragePath } from "@/server/storage/resolve-url";
import { requirePermission } from "@/lib/admin/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((item): item is File => item instanceof File);
    const directory = normalizeStoragePath(String(formData.get("directory") ?? ""));
    const startIndex = Number(formData.get("startIndex") ?? 0);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (!directory || directory.includes("..")) {
      return NextResponse.json({ error: "Invalid upload directory" }, { status: 400 });
    }

    if (directory.startsWith("news/")) {
      await requirePermission("news.manage");
    } else if (directory.startsWith("listings/")) {
      await requirePermission("listings.update");
    } else {
      return NextResponse.json({ error: "Upload directory is not allowed" }, { status: 403 });
    }

    const urls: string[] = [];
    for (const [offset, file] of files.entries()) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File quá lớn (tối đa 10 MB)` }, { status: 400 });
      }

      const imageIndex = startIndex + offset;
      const fileName = imageIndex === 0 ? "cover.webp" : `${imageIndex}.webp`;
      const storagePath = await writableStorageProvider.uploadImage({
        file,
        directory,
        fileName,
      });
      urls.push(storagePath);
    }

    return NextResponse.json({ urls });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
