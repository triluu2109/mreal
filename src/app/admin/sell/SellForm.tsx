"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSaleListing, updateSaleListing, updateSaleListingMedia } from "@/app/actions/sell";
import ImageUploadField from "@/app/admin/_components/ImageUploadField";
import { parseSellRaw } from "@/lib/listing-parsers";

const FURNISHING_OPTIONS = [
  { value: "DEVELOPER_HANDOVER", label: "Hoàn thiện cơ bản / Chủ đầu tư" },
  { value: "BASIC_FURNISHED", label: "Nội thất cơ bản" },
  { value: "FULLY_FURNISHED", label: "Full nội thất" },
] as const;

type FurnishingStatusValue = (typeof FURNISHING_OPTIONS)[number]["value"];

type SellFormState = {
  projectCode: string;
  unitCode: string;
  areaSqm: string;
  bedrooms: string;
  bathrooms: string;
  furnishingStatus: FurnishingStatusValue;
  furnishingNote: string;
  view: string;
  contractPrice: string;
  sellingPrice: string;
  displayPrice: string;
  availability: string;
  sourceName: string;
  note: string;
  imagePaths: string[];
  isVisible: boolean;
  isFeatured: boolean;
  rawText: string;
};

export type SellFormInitialData = {
  id: string;
  projectCode: string;
  unitCode: string;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  furnishingStatus: FurnishingStatusValue;
  furnishingNote: string | null;
  view: string | null;
  contractPrice: number | null;
  sellingPrice: number;
  displayPrice: string;
  availability: string | null;
  sourceName: string | null;
  note: string | null;
  imagePaths: string[];
  isVisible: boolean;
  isFeatured: boolean;
};

type FieldValue = string | boolean | string[];
type FieldProps = {
  label: string;
  name: keyof SellFormState;
  form: SellFormState;
  setField: (name: keyof SellFormState, value: FieldValue) => void;
  className?: string;
  placeholder?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "form" | "name" | "value" | "onChange">;

export default function SellForm({ initialData = null }: { initialData?: SellFormInitialData | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [listingId] = useState(() => initialData?.id ?? crypto.randomUUID());
  const [form, setForm] = useState<SellFormState>({
    projectCode: initialData?.projectCode ?? "",
    unitCode: initialData?.unitCode ?? "",
    areaSqm: initialData?.areaSqm?.toString() ?? "",
    bedrooms: initialData?.bedrooms?.toString() ?? "",
    bathrooms: initialData?.bathrooms?.toString() ?? "",
    furnishingStatus: initialData?.furnishingStatus ?? "DEVELOPER_HANDOVER",
    furnishingNote: initialData?.furnishingNote ?? "",
    view: initialData?.view ?? "",
    contractPrice: initialData?.contractPrice?.toString() ?? "",
    sellingPrice: initialData?.sellingPrice?.toString() ?? "",
    displayPrice: initialData?.displayPrice ?? "",
    availability: initialData?.availability ?? "",
    sourceName: initialData?.sourceName ?? "",
    note: initialData?.note ?? "",
    imagePaths: initialData?.imagePaths ?? [],
    isVisible: initialData?.isVisible ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    rawText: "",
  });

  const setField = (name: keyof SellFormState, value: string | boolean | string[]) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  function parseRaw() {
    const parsed = parseSellRaw(form.rawText);
    setForm((current) => ({
      ...current,
      projectCode: parsed.projectCode?.toString() ?? current.projectCode,
      unitCode: parsed.unitCode?.toString() ?? current.unitCode,
      areaSqm: parsed.areaSqm?.toString() ?? current.areaSqm,
      bedrooms: parsed.bedrooms?.toString() ?? current.bedrooms,
      bathrooms: parsed.bathrooms?.toString() ?? current.bathrooms,
      view: parsed.view?.toString() ?? current.view,
      rawText: current.rawText,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {
      projectCode: form.projectCode.trim(),
      unitCode: form.unitCode.trim(),
      areaSqm: Number(form.areaSqm),
      bedrooms: parseInt(form.bedrooms, 10),
      bathrooms: parseInt(form.bathrooms, 10),
      furnishingStatus: form.furnishingStatus,
      furnishingNote: form.furnishingNote || null,
      view: form.view || null,
      contractPrice: form.contractPrice ? Number(form.contractPrice) : null,
      sellingPrice: Number(form.sellingPrice),
      displayPrice: form.displayPrice.trim() || null,
      availability: form.availability || null,
      sourceName: form.sourceName || null,
      note: form.note || null,
      imagePaths: form.imagePaths,
      isVisible: form.isVisible,
      isFeatured: form.isFeatured,
      id: listingId,
    };

    startTransition(async () => {
      const res = initialData?.id
        ? await updateSaleListing(initialData.id, data)
        : await createSaleListing(data);
      if (res.success) {
        toast.success(initialData?.id ? "Đã cập nhật căn bán" : "Đã tạo căn bán");
        router.push("/admin/sell");
        router.refresh();
      } else {
        toast.error(res.error || "Có lỗi xảy ra");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-6 lg:p-8 max-w-5xl">
      <div className="mb-6">
        <label className="block text-sm font-medium text-navy mb-2">Dán dòng giỏ hàng bán</label>
        <textarea value={form.rawText} onChange={(e) => setField("rawText", e.target.value)} rows={3} className="w-full border border-gray-border rounded-lg px-4 py-2.5" />
        <button type="button" onClick={parseRaw} className="mt-3 bg-gold text-white px-4 py-2 rounded-lg text-sm font-semibold">Tự điền từ dòng trên</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Mã dự án *" name="projectCode" form={form} setField={setField} required />
        <Input label="Mã căn *" name="unitCode" form={form} setField={setField} required />
        <Input label="Diện tích m² *" name="areaSqm" form={form} setField={setField} type="number" step="0.01" required />
        <Input label="Phòng ngủ *" name="bedrooms" form={form} setField={setField} type="number" required />
        <Input label="WC *" name="bathrooms" form={form} setField={setField} type="number" required />

        <label>
          <span className="block text-sm font-medium text-navy mb-2">Tình trạng nội thất *</span>
          <select
            value={form.furnishingStatus}
            onChange={(e) => setField("furnishingStatus", e.target.value)}
            className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold"
          >
            {FURNISHING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>

        <Input label="Chi tiết nội thất" name="furnishingNote" form={form} setField={setField} placeholder="VD: Full nội thất cao cấp" />
        <Input label="View" name="view" form={form} setField={setField} />
        <Input label="Giá hợp đồng (VND)" name="contractPrice" form={form} setField={setField} type="number" step="1000000" placeholder="VD: 2800000000" />
        <Input label="Giá bán (VND) *" name="sellingPrice" form={form} setField={setField} type="number" step="1000000" required placeholder="VD: 3250000000" />
        <Input label="Giá hiển thị" name="displayPrice" form={form} setField={setField} placeholder="VD: 3,25 tỷ" />
        <Input label="Tình trạng" name="availability" form={form} setField={setField} placeholder="VD: Đang ở, Sắp bàn giao" />
        <Input label="Nguồn" name="sourceName" form={form} setField={setField} />
        <Textarea label="Ghi chú" name="note" form={form} setField={setField} className="md:col-span-2" />

        <div className="md:col-span-2">
          <ImageUploadField
            value={form.imagePaths}
            onChange={(paths) => setField("imagePaths", paths)}
            directory={`listings/sell/${listingId}`}
            persistMedia={initialData?.id ? (paths, removedPath) => updateSaleListingMedia(initialData.id, paths, removedPath) : undefined}
          />
        </div>
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm font-medium text-navy">
        <input type="checkbox" checked={form.isVisible} onChange={(e) => setField("isVisible", e.target.checked)} className="w-5 h-5" />
        Hiển thị trên giỏ hàng
      </label>

      <label className="mt-3 flex items-center gap-3 text-sm font-medium text-navy">
        <input type="checkbox" checked={form.isFeatured} onChange={(e) => setField("isFeatured", e.target.checked)} className="w-5 h-5" />
        Đánh dấu căn nổi bật
      </label>

      <div className="mt-8 flex justify-end gap-3 border-t border-gray-border pt-6">
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg border border-gray-border text-gray-text font-medium">Hủy</button>
        <button type="submit" disabled={isPending} className="bg-navy hover:bg-navy-light text-white px-8 py-2.5 rounded-lg font-medium disabled:opacity-60">
          {isPending ? "Đang lưu..." : initialData?.id ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
}

function Input({ label, name, form, setField, className = "", placeholder, ...props }: FieldProps) {
  return (
    <label className={className}>
      <span className="block text-sm font-medium text-navy mb-2">{label}</span>
      <input value={String(form[name])} onChange={(e) => setField(name, e.target.value)} placeholder={placeholder} className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold" {...props} />
    </label>
  );
}

function Textarea({ label, name, form, setField, className = "" }: Omit<FieldProps, "placeholder">) {
  return (
    <label className={className}>
      <span className="block text-sm font-medium text-navy mb-2">{label}</span>
      <textarea value={String(form[name])} onChange={(e) => setField(name, e.target.value)} rows={3} className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold" />
    </label>
  );
}
