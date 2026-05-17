"use client";

import { FormEvent, useState, useTransition } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { submitAppointment } from "@/app/actions/appointment";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function ConsignmentForm() {
  const { dict: vi } = useI18n();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = new FormData(form);
    const payload = new FormData();
    const details = [
      `${vi.consignment_page.detail_labels.need}: ${input.get("intent") || vi.consignment_page.options.not_selected}`,
      input.get("bedrooms") && `${vi.consignment_page.detail_labels.bedrooms}: ${input.get("bedrooms")}`,
      input.get("area") && `${vi.consignment_page.detail_labels.area}: ${input.get("area")} m2`,
      input.get("furnishing") && `${vi.consignment_page.detail_labels.furnishing}: ${input.get("furnishing")}`,
      input.get("expectedPrice") && `${vi.consignment_page.detail_labels.expected_price}: ${input.get("expectedPrice")}`,
      input.get("note") && `${vi.consignment_page.detail_labels.note}: ${input.get("note")}`,
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
        setError(result.error ?? vi.consignment_page.error);
      }
    });
  };

  if (success) {
    return (
      <div className="rounded-lg border border-gray-border bg-white p-8 text-center shadow-card">
        <CheckCircle size={52} className="mx-auto mb-4 text-green-500" />
        <h2 className="font-heading text-2xl font-bold text-navy">{vi.consignment_page.success_title}</h2>
        <p className="mt-2 text-gray-text">{vi.consignment_page.success_desc}</p>
        <button onClick={() => setSuccess(false)} className="mt-6 rounded-lg bg-gold px-6 py-3 font-heading font-bold text-white hover:bg-gold-dark">
          {vi.consignment_page.send_another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-gray-border bg-white p-6 shadow-card sm:p-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label={`${vi.common.full_name} *`}><input name="fullName" required className={inputClass} /></Field>
        <Field label={`${vi.common.phone_number} *`}><input name="phone" required inputMode="tel" className={inputClass} /></Field>
        <Field label={vi.consignment_page.fields.intent}><select name="intent" className={inputClass} defaultValue={vi.consignment_page.options.sell}><option>{vi.consignment_page.options.sell}</option><option>{vi.consignment_page.options.rent}</option><option>{vi.consignment_page.options.sell_or_rent}</option></select></Field>
        <Field label={vi.consignment_page.fields.bedrooms}><input name="bedrooms" placeholder={vi.consignment_page.placeholders.bedrooms} className={inputClass} /></Field>
        <Field label={vi.consignment_page.fields.area}><input name="area" inputMode="decimal" placeholder={vi.consignment_page.placeholders.area} className={inputClass} /></Field>
        <Field label={vi.consignment_page.fields.furnishing}><input name="furnishing" placeholder={vi.consignment_page.placeholders.furnishing} className={inputClass} /></Field>
        <Field label={vi.consignment_page.fields.expected_price}><input name="expectedPrice" placeholder={vi.consignment_page.placeholders.expected_price} className={inputClass} /></Field>
        <div className="md:col-span-2">
          <Field label={vi.common.note}><textarea name="note" rows={4} className={`${inputClass} resize-none`} placeholder={vi.consignment_page.placeholders.note} /></Field>
        </div>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={isPending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 font-heading font-bold text-white hover:bg-navy-light disabled:opacity-70">
        {isPending ? <><Loader2 size={18} className="animate-spin" /> {vi.common.loading_send}</> : vi.consignment_page.submit}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-navy">{label}<div className="mt-2">{children}</div></label>;
}

const inputClass = "w-full rounded-lg border border-gray-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
