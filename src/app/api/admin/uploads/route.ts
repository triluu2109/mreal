import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const bucketName = process.env.SUPABASE_STORAGE_BUCKET ?? "listing-images";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const supabase = createServiceClient();
    await ensureBucket(supabase);

    const urls: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `listings/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from(bucketName).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Upload failed" }, { status: 500 });
  }
}

async function ensureBucket(supabase: ReturnType<typeof createServiceClient>) {
  const { data: bucket } = await supabase.storage.getBucket(bucketName);
  if (bucket) return;

  await supabase.storage.createBucket(bucketName, {
    public: true,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });
}
