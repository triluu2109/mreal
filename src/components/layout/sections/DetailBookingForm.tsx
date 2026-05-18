"use client";

import { useState, useTransition } from "react";
import { Calendar, CheckCircle, Loader2 } from "lucide-react";
import { submitAppointment } from "@/app/actions/appointment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/components/i18n/I18nProvider";

interface DetailBookingFormProps {
  listingTitle: string;
  listingType: "sell" | "rent";
  price: string;
  source: "listing-detail-sell" | "listing-detail-rent";
}

export default function DetailBookingForm({
  listingTitle,
  listingType,
  price,
  source,
}: DetailBookingFormProps) {
  const { dict: vi } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);

    const note = String(formData.get("note") ?? "").trim();
    const budget = String(formData.get("budget") ?? "").trim();
    const budgetContext = [budget, note].filter(Boolean).join(" | ");

    formData.delete("note");
    formData.set(
      "need",
      [
        `${vi.detail_booking.need_prefix} ${listingType === "sell" ? vi.detail_booking.buy_action : vi.detail_booking.rent_action}: ${listingTitle}`,
        `${vi.detail_booking.price_label}: ${price}`,
      ].join(" | "),
    );
    formData.set("budget", budgetContext);
    formData.set("source", source);

    startTransition(async () => {
      const result = await submitAppointment(formData);
      if (result.success) {
        setSuccess(true);
        return;
      }

      setError(result.error ?? vi.detail_booking.error);
    });
  }

  if (success) {
    return (
      <div className="sticky top-24 bg-white rounded-lg border border-gray-border shadow-card p-6 text-center">
        <CheckCircle size={44} className="mx-auto mb-4 text-green-500" />
        <h2 className="font-heading font-bold text-navy text-xl mb-2">{vi.detail_booking.success_title}</h2>
        <p className="text-gray-text text-sm mb-5">
          {vi.detail_booking.success_desc}
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="w-full border-2 border-gold text-gold font-heading font-semibold py-3 rounded-lg hover:bg-gold/5 transition-colors"
        >
          {vi.detail_booking.send_another}
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="sticky top-24 bg-white rounded-lg border border-gray-border shadow-card p-6 space-y-4">
      <div className="border-b border-gray-border pb-4">
        <div className="flex items-center gap-2 text-gold mb-2">
          <Calendar size={18} />
          <h2 className="font-heading font-bold text-navy text-lg">{vi.detail_booking.title}</h2>
        </div>
        <div className="text-2xl font-heading font-bold text-gold">{price}</div>
        <p className="text-gray-text text-sm mt-1">{vi.common.project_name}</p>
      </div>

      <div>
        <Label htmlFor="detail-fullName" className="text-navy font-medium mb-1.5 block">
          {vi.common.full_name} <span className="text-red-500">*</span>
        </Label>
        <Input id="detail-fullName" name="fullName" placeholder={vi.home.booking.full_name_placeholder} required minLength={2} />
      </div>

      <div>
        <Label htmlFor="detail-phone" className="text-navy font-medium mb-1.5 block">
          {vi.common.phone_number} <span className="text-red-500">*</span>
        </Label>
        <Input id="detail-phone" name="phone" placeholder={vi.home.booking.phone_placeholder} required minLength={9} />
      </div>

      <div>
        <Label htmlFor="detail-appointmentTime" className="text-navy font-medium mb-1.5 block">
          {vi.detail_booking.appointment_time}
        </Label>
        <Input id="detail-appointmentTime" name="appointmentTime" type="datetime-local" />
      </div>

      <div>
        <Label htmlFor="detail-contactMethod" className="text-navy font-medium mb-1.5 block">
          {vi.detail_booking.contact_method}
        </Label>
        <select
          id="detail-contactMethod"
          name="contactMethod"
          defaultValue={vi.detail_booking.contact_methods.phone}
          className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option>{vi.detail_booking.contact_methods.phone}</option>
          <option>{vi.detail_booking.contact_methods.zalo}</option>
          <option>{vi.detail_booking.contact_methods.sms}</option>
          <option>{vi.detail_booking.contact_methods.email}</option>
        </select>
      </div>

      <div>
        <Label htmlFor="detail-budget" className="text-navy font-medium mb-1.5 block">
          {vi.detail_booking.budget}
        </Label>
        <Input id="detail-budget" name="budget" placeholder={listingType === "sell" ? vi.detail_booking.budget_placeholder_sell : vi.detail_booking.budget_placeholder_rent} />
      </div>

      <div>
        <Label htmlFor="detail-note" className="text-navy font-medium mb-1.5 block">
          {vi.common.note}
        </Label>
        <Textarea id="detail-note" name="note" placeholder={vi.detail_booking.note_placeholder} rows={3} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="btn-gold w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {vi.common.loading_send}
          </>
        ) : (
          vi.detail_booking.submit
        )}
      </button>

      <p className="text-gray-text text-xs text-center">
        {vi.detail_booking.consent}
      </p>
    </form>
  );
}
