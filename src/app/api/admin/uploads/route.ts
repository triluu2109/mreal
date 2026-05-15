import { NextResponse } from "next/server";
import { writableStorageProvider } from "@/lib/storage/server-storage";
import { normalizeStoragePath } from "@/server/storage/resolve-url";

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

    const urls: string[] = [];
    for (const [offset, file] of files.entries()) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
      }

      const imageIndex = startIndex + offset;
      const fileName = imageIndex === 0 ? "cover.webp" : `${imageIndex}.webp`;
      const url = await writableStorageProvider.uploadImage({
        file,
        directory,
        fileName,
      });
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Upload failed" }, { status: 500 });
  }
}
