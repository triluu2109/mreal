"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Loader2, Star, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import { isListingImageFile, normalizeListingImagePaths, nextListingImageIndex } from "@/lib/listing-media";

type PersistMedia = (paths: string[], removedPath?: string) => Promise<{ success: boolean; imagePaths?: string[]; error?: string }>;

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  directory: string;
  persistMedia?: PersistMedia;
};

type Operation = "upload" | "delete" | "reorder" | "cover" | null;

export default function ImageUploadField({ value, onChange, directory, persistMedia }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [dragActive, setDragActive] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const images = useMemo(() => normalizeListingImagePaths(value), [value]);
  const busy = operation !== null;

  useEffect(() => {
    if (images.length !== value.length || images.some((image, index) => image !== value[index])) {
      onChange(images);
    }
  }, [images, onChange, value]);

  async function commit(nextPaths: string[], operationName: Exclude<Operation, null>, removedPath?: string) {
    const normalizedNext = normalizeListingImagePaths(nextPaths);
    const previous = images;

    onChange(normalizedNext);

    if (!persistMedia) return true;

    setOperation(operationName);
    try {
      const result = await persistMedia(normalizedNext, removedPath);
      if (!result.success) throw new Error(result.error || "Không cập nhật được hình ảnh");
      if (result.imagePaths) onChange(result.imagePaths);
      return true;
    } catch (error) {
      onChange(previous);
      toast.error(error instanceof Error ? error.message : "Không cập nhật được hình ảnh");
      return false;
    } finally {
      setOperation(null);
    }
  }

  async function handleFiles(files: FileList | File[] | null) {
    const fileList = Array.from(files ?? []);
    if (fileList.length === 0) return;

    const invalidFiles = fileList.filter((file) => !isListingImageFile(file));
    if (invalidFiles.length > 0) {
      toast.error("Chỉ hỗ trợ ảnh .jpg, .jpeg, .png, .webp, .avif");
      if (inputRef.current) inputRef.current.value = "";
      setDragActive(false);
      return;
    }

    setOperation("upload");
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file));
    formData.set("directory", directory);
    formData.set("startIndex", String(nextListingImageIndex(images)));

    try {
      const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const data = (await response.json()) as { urls?: string[]; error?: string };
      if (!response.ok || !data.urls) throw new Error(data.error || "Upload failed");

      const nextPaths = normalizeListingImagePaths([...images, ...data.urls]);
      onChange(nextPaths);

      if (persistMedia) {
        const result = await persistMedia(nextPaths);
        if (!result.success) throw new Error(result.error || "Không lưu được gallery");
        if (result.imagePaths) onChange(result.imagePaths);
      }

      toast.success(`Đã upload ${data.urls.length} ảnh`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không upload được ảnh");
    } finally {
      setOperation(null);
      setDragActive(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || busy) return;
    const oldIndex = images.indexOf(String(active.id));
    const newIndex = images.indexOf(String(over.id));
    if (oldIndex >= 0 && newIndex >= 0) {
      await commit(arrayMove(images, oldIndex, newIndex), "reorder");
    }
  }

  async function removeImage(imagePath: string) {
    if (busy) return;
    await commit(images.filter((item) => item !== imagePath), "delete", imagePath);
  }

  async function setCover(imagePath: string) {
    if (busy) return;
    await commit([imagePath, ...images.filter((item) => item !== imagePath)], "cover");
  }

  return (
    <div className="md:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <span className="block text-sm font-semibold text-navy">Hình ảnh</span>
          <span className="text-xs text-gray-muted">
            Kéo thả để upload, kéo ảnh để sắp xếp. Ảnh đầu tiên là cover.
          </span>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-60"
        >
          {operation === "upload" ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {operation === "upload" ? "Đang upload..." : "Chọn ảnh"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif"
        multiple
        onChange={(event) => void handleFiles(event.target.files)}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "mb-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-70",
          dragActive ? "border-gold bg-gold/10" : "border-gray-border bg-gray-bg hover:border-gold/60 hover:bg-gold/5"
        )}
      >
        <UploadCloud className="mb-3 text-gold" size={30} />
        <span className="text-sm font-semibold text-navy">Thả ảnh vào đây hoặc bấm để chọn</span>
        <span className="mt-1 text-xs text-gray-muted">Chỉ nhận JPG, PNG, WebP, AVIF. File mới được đổi tên theo index tiếp theo.</span>
      </button>

      {busy && operation !== "upload" ? (
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-gray-bg px-3 py-2 text-xs font-semibold text-gray-text">
          <Loader2 size={14} className="animate-spin text-gold" />
          {operation === "delete" ? "Đang xóa ảnh..." : operation === "reorder" ? "Đang lưu thứ tự..." : "Đang đổi cover..."}
        </div>
      ) : null}

      {images.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => void handleDragEnd(event)}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((url, index) => (
                <SortableImage
                  key={url}
                  url={url}
                  isCover={index === 0}
                  disabled={busy}
                  onRemove={() => void removeImage(url)}
                  onSetCover={() => void setCover(url)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="rounded-lg border border-gray-border bg-gray-bg px-4 py-5 text-sm text-gray-muted">
          Listing chưa có ảnh hợp lệ.
        </div>
      )}
    </div>
  );
}

function SortableImage({
  url,
  isCover,
  disabled,
  onRemove,
  onSetCover,
}: {
  url: string;
  isCover: boolean;
  disabled: boolean;
  onRemove: () => void;
  onSetCover: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url, disabled });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-xl border bg-gray-bg shadow-sm",
        isCover ? "border-gold ring-2 ring-gold/30" : "border-gray-border",
        isDragging && "z-10 opacity-70",
        disabled && "opacity-80"
      )}
    >
      <Image src={getImageUrl(url)} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/60 to-transparent p-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          className="inline-flex h-8 w-8 cursor-grab items-center justify-center rounded-lg bg-white/90 text-navy shadow-sm disabled:cursor-not-allowed disabled:opacity-60 active:cursor-grabbing"
          title="Kéo để sắp xếp"
        >
          <GripVertical size={15} />
        </button>
        {isCover ? (
          <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-white shadow-sm">Cover</span>
        ) : (
          <button
            type="button"
            onClick={onSetCover}
            disabled={disabled}
            className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-navy shadow-sm hover:bg-white disabled:opacity-60"
          >
            <Star size={12} />
            Cover
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-600 shadow-sm transition-colors hover:bg-white disabled:opacity-60"
        title="Xóa ảnh"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
