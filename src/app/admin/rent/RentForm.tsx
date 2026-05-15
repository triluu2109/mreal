"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createRent, updateRent } from "@/app/actions/rent";
import ImageUploadField from "@/app/admin/_components/ImageUploadField";
import { parseRentRaw } from "@/lib/listing-parsers";

type RentFormState = {
  projectCode: string;
  unitCode: string;
  areaSqm: string;
  bedrooms: string;
  bathrooms: string;
  furnishing: string;
  view: string;
  price: string;
  availability: string;
  sourceName: string;
  note: string;
  imageUrls: string[];
  isVisible: boolean;
  rawText: string;
};

export default function RentForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<RentFormState>({
    projectCode: initialData?.projectCode ?? "",
    unitCode: initialData?.unitCode ?? "",
    areaSqm: initialData?.areaSqm?.toString() ?? "",
    bedrooms: initialData?.bedrooms?.toString() ?? "",
    bathrooms: initialData?.bathrooms?.toString() ?? "",
    furnishing: initialData?.furnishing ?? "",
    view: initialData?.view ?? "",
    price: initialData?.price?.toString() ?? "",
    availability: initialData?.availability ?? "",
    sourceName: initialData?.sourceName ?? "",
    note: initialData?.note ?? "",
    imageUrls: initialData?.imageUrls ?? [],
    isVisible: initialData?.isVisible ?? true,
    rawText: "",
  });

  const setField = (name: keyof RentFormState, value: string | boolean | string[]) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  function parseRaw() {
    const parsed = parseRentRaw(form.rawText);
    setForm((current) => ({
      ...current,
      ...stringifyParsed(parsed),
      rawText: current.rawText,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {
      projectCode: form.projectCode.trim(),
      unitCode: form.unitCode.trim(),
      areaSqm: numberValue(form.areaSqm),
      bedrooms: intValue(form.bedrooms),
      bathrooms: intValue(form.bathrooms),
      furnishing: emptyToNull(form.furnishing),
      view: emptyToNull(form.view),
      price: numberValue(form.price),
      availability: emptyToNull(form.availability),
      sourceName: emptyToNull(form.sourceName),
      note: emptyToNull(form.note),
      imageUrls: form.imageUrls,
      isVisible: form.isVisible,
    };

    startTransition(async () => {
      const res = initialData?.id ? await updateRent(initialData.id, data) : await createRent(data);
      if (res.success) {
        toast.success(initialData?.id ? "Đã cập nhật căn thuê" : "Đã tạo căn thuê");
        router.push("/admin/rent");
        router.refresh();
      } else {
        toast.error(res.error || "Có lỗi xảy ra");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-6 lg:p-8 max-w-5xl">
      <div className="mb-6">
        <label className="block text-sm font-medium text-navy mb-2">Dán dòng giỏ hàng thuê</label>
        <textarea value={form.rawText} onChange={(e) => setField("rawText", e.target.value)} rows={3} className="w-full border border-gray-border rounded-lg px-4 py-2.5" />
        <button type="button" onClick={parseRaw} className="mt-3 bg-gold text-white px-4 py-2 rounded-lg text-sm font-semibold">Tự điền từ dòng trên</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Mã dự án *" name="projectCode" form={form} setField={setField} required />
        <Input label="Mã căn *" name="unitCode" form={form} setField={setField} required />
        <Input label="Diện tích m2 *" name="areaSqm" form={form} setField={setField} type="number" step="0.01" required />
        <Input label="Phòng ngủ *" name="bedrooms" form={form} setField={setField} type="number" required />
        <Input label="WC *" name="bathrooms" form={form} setField={setField} type="number" required />
        <Input label="Nội thất" name="furnishing" form={form} setField={setField} />
        <Input label="View" name="view" form={form} setField={setField} />
        <Input label="Giá thuê (triệu) *" name="price" form={form} setField={setField} type="number" step="0.01" required />
        <Input label="Tình trạng" name="availability" form={form} setField={setField} />
        <Input label="Nguồn" name="sourceName" form={form} setField={setField} />
        <Textarea label="Ghi chú" name="note" form={form} setField={setField} className="md:col-span-2" />
        <ImageUploadField value={form.imageUrls} onChange={(urls) => setField("imageUrls", urls)} />
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm font-medium text-navy">
        <input type="checkbox" checked={form.isVisible} onChange={(e) => setField("isVisible", e.target.checked)} className="w-5 h-5" />
        Hiển thị trên giỏ hàng
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

function Input({ label, name, form, setField, className = "", ...props }: any) {
  return (
    <label className={className}>
      <span className="block text-sm font-medium text-navy mb-2">{label}</span>
      <input value={form[name]} onChange={(e) => setField(name, e.target.value)} className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold" {...props} />
    </label>
  );
}

function Textarea({ label, name, form, setField, className = "" }: any) {
  return (
    <label className={className}>
      <span className="block text-sm font-medium text-navy mb-2">{label}</span>
      <textarea value={form[name]} onChange={(e) => setField(name, e.target.value)} rows={3} className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold" />
    </label>
  );
}

function stringifyParsed(parsed: any): Partial<RentFormState> {
  return Object.fromEntries(Object.entries(parsed).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]));
}

function emptyToNull(value: string) {
  return value.trim() || null;
}

function numberValue(value: string) {
  return Number(value);
}

function intValue(value: string) {
  return parseInt(value, 10);
}
