"use client";

import { FormEvent, useState, useTransition } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { submitAppointment } from "@/app/actions/appointment";

export default function ConsignmentForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = new FormData(form);
    const payload = new FormData();
    const details = [
      `Nhu cầu: ${input.get("intent") || "Chưa chọn"}`,
      input.get("bedrooms") && `Phòng ngủ: ${input.get("bedrooms")}`,
      input.get("area") && `Diện tích: ${input.get("area")} m2`,
      input.get("furnishing") && `Nội thất: ${input.get("furnishing")}`,
      input.get("expectedPrice") && `Giá mong muốn: ${input.get("expectedPrice")}`,
      input.get("note") && `Ghi chú: ${input.get("note")}`,
    ].filter(Boolean).join(" | ");

    payload.set("fullName", String(input.get("fullName") ?? ""));
    payload.set("phone", String(input.get("phone") ?? ""));
    payload.set("need", details);
    payload.set("budget", String(input.get("expectedPrice") ?? ""));
    payload.set("source", "consignment");

    startTransition(async () => {
      setError(null);
      const result = await submitAppointment(payload);
      if (result.success) {
        setSuccess(true);
        form.reset();
      } else {
        setError(result.error ?? "Không gửi được thông tin. Vui lòng thử lại.");
      }
    });
  };

  if (success) {
    return (
      <div className="rounded-lg border border-gray-border bg-white p-8 text-center shadow-card">
        <CheckCircle size={52} className="mx-auto mb-4 text-green-500" />
        <h2 className="font-heading text-2xl font-bold text-navy">Đã nhận thông tin ký gửi</h2>
        <p className="mt-2 text-gray-text">Chuyên viên sẽ liên hệ để xác nhận thông tin căn hộ và phương án bán/cho thuê.</p>
        <button onClick={() => setSuccess(false)} className="mt-6 rounded-lg bg-gold px-6 py-3 font-heading font-bold text-white hover:bg-gold-dark">
          Gửi căn khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-gray-border bg-white p-6 shadow-card sm:p-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Họ và tên *"><input name="fullName" required className={inputClass} /></Field>
        <Field label="Số điện thoại *"><input name="phone" required inputMode="tel" className={inputClass} /></Field>
        <Field label="Nhu cầu"><select name="intent" className={inputClass} defaultValue="Bán"><option>Bán</option><option>Cho thuê</option><option>Bán hoặc cho thuê</option></select></Field>
        <Field label="Số phòng ngủ"><input name="bedrooms" placeholder="VD: 2PN2WC" className={inputClass} /></Field>
        <Field label="Diện tích"><input name="area" inputMode="decimal" placeholder="VD: 68" className={inputClass} /></Field>
        <Field label="Nội thất"><input name="furnishing" placeholder="VD: full nội thất" className={inputClass} /></Field>
        <Field label="Giá mong muốn"><input name="expectedPrice" placeholder="VD: 4.2 tỷ hoặc 15 triệu/tháng" className={inputClass} /></Field>
        <div className="md:col-span-2">
          <Field label="Ghi chú"><textarea name="note" rows={4} className={`${inputClass} resize-none`} placeholder="Block, tầng, view, tình trạng sổ/hợp đồng..." /></Field>
        </div>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={isPending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 font-heading font-bold text-white hover:bg-navy-light disabled:opacity-70">
        {isPending ? <><Loader2 size={18} className="animate-spin" /> Đang gửi...</> : "Gửi thông tin ký gửi"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-navy">{label}<div className="mt-2">{children}</div></label>;
}

const inputClass = "w-full rounded-lg border border-gray-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
