import { NextResponse } from "next/server";
import { writableStorageProvider } from "@/server/storage/provider";
import { normalizeStoragePath } from "@/server/storage/resolve-url";
import { requirePermission } from "@/lib/admin/auth";
import { isListingImageFile, LISTING_IMAGE_MIME_TYPES, mediaExtension } from "@/lib/listing-media";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set<string>(LISTING_IMAGE_MIME_TYPES);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((item): item is File => item instanceof File);
    const directory = normalizeStoragePath(String(formData.get("directory") ?? ""));
    const startIndex = Math.max(1, Number(formData.get("startIndex") ?? 1) || 1);

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
      if (!ALLOWED_TYPES.has(file.type) || !isListingImageFile(file)) {
        return NextResponse.json({ error: "Chỉ hỗ trợ ảnh .jpg, .jpeg, .png, .webp, .avif" }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File quá lớn (tối đa 10 MB)` }, { status: 400 });
      }

      const imageIndex = startIndex + offset;
      const fileName = `${imageIndex}${mediaExtension(file.name)}`;
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
