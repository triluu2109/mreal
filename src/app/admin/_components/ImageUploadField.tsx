"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export default function ImageUploadField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      onChange([...value, ...data.urls]);
      toast.success("Đã upload ảnh");
    } catch (error: any) {
      toast.error(error.message || "Không upload được ảnh");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="block text-sm font-medium text-navy">Hình ảnh</span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          <ImagePlus size={16} />
          {uploading ? "Đang upload..." : "Chọn ảnh"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => handleFiles(event.target.files)}
        className="hidden"
      />

      {value.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {value.map((url) => (
            <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-border bg-gray-bg">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== url))}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-600 shadow-sm hover:bg-white"
                title="Xóa ảnh"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-border bg-gray-bg px-4 py-8 text-center text-sm text-gray-text">
          Chưa có ảnh.
        </div>
      )}
    </div>
  );
}
