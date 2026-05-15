"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Star, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  directory: string;
};

export default function ImageUploadField({ value, onChange, directory }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function handleFiles(files: FileList | File[] | null) {
    const fileList = Array.from(files ?? []);
    if (fileList.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file));
    formData.set("directory", directory);
    formData.set("startIndex", String(value.length));

    try {
      const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const data = (await response.json()) as { urls?: string[]; error?: string };
      if (!response.ok || !data.urls) throw new Error(data.error || "Upload failed");
      onChange([...value, ...data.urls]);
      toast.success(`Đã upload ${data.urls.length} ảnh`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không upload được ảnh");
    } finally {
      setUploading(false);
      setDragActive(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = value.indexOf(String(active.id));
    const newIndex = value.indexOf(String(over.id));
    if (oldIndex >= 0 && newIndex >= 0) {
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  }

  function removeImage(path: string) {
    onChange(value.filter((item) => item !== path));
  }

  function setCover(path: string) {
    onChange([path, ...value.filter((item) => item !== path)]);
  }

  return (
    <div className="md:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <span className="block text-sm font-semibold text-navy">Hình ảnh</span>
          <span className="text-xs text-gray-muted">Kéo thả để upload, kéo ảnh để sắp xếp. Ảnh đầu tiên là cover.</span>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-60"
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

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "mb-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          dragActive ? "border-gold bg-gold/10" : "border-gray-border bg-gray-bg hover:border-gold/60 hover:bg-gold/5"
        )}
      >
        <UploadCloud className="mb-3 text-gold" size={30} />
        <span className="text-sm font-semibold text-navy">Thả ảnh vào đây hoặc bấm để chọn</span>
        <span className="mt-1 text-xs text-gray-muted">Hỗ trợ upload nhiều ảnh, tự chuyển sang WebP.</span>
      </button>

      {value.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {value.map((url, index) => (
                <SortableImage
                  key={url}
                  url={url}
                  isCover={index === 0}
                  onRemove={() => removeImage(url)}
                  onSetCover={() => setCover(url)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : null}
    </div>
  );
}

function SortableImage({
  url,
  isCover,
  onRemove,
  onSetCover,
}: {
  url: string;
  isCover: boolean;
  onRemove: () => void;
  onSetCover: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-border bg-gray-bg shadow-sm",
        isDragging && "z-10 opacity-70"
      )}
    >
      <Image src={getImageUrl(url)} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/60 to-transparent p-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="inline-flex h-8 w-8 cursor-grab items-center justify-center rounded-lg bg-white/90 text-navy shadow-sm active:cursor-grabbing"
          title="Kéo để sắp xếp"
        >
          <GripVertical size={15} />
        </button>
        {isCover ? (
          <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-white">Cover</span>
        ) : (
          <button
            type="button"
            onClick={onSetCover}
            className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-navy shadow-sm hover:bg-white"
          >
            <Star size={12} />
            Cover
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-600 shadow-sm transition-colors hover:bg-white"
        title="Xóa ảnh"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
