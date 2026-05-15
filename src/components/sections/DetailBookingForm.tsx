"use client";

import { useState, useTransition } from "react";
import { Calendar, CheckCircle, Loader2 } from "lucide-react";
import { submitAppointment } from "@/app/actions/appointment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        `Cần tư vấn ${listingType === "sell" ? "mua" : "thuê"}: ${listingTitle}`,
        `Giá: ${price}`,
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

      setError(result.error ?? "Không thể gửi lịch hẹn. Vui lòng thử lại.");
    });
  }

  if (success) {
    return (
      <div className="sticky top-24 bg-white rounded-lg border border-gray-border shadow-card p-6 text-center">
        <CheckCircle size={44} className="mx-auto mb-4 text-green-500" />
        <h2 className="font-heading font-bold text-navy text-xl mb-2">Đã nhận thông tin</h2>
        <p className="text-gray-text text-sm mb-5">
          Chuyên viên sẽ liên hệ xác nhận lịch tư vấn cho căn này trong thời gian sớm nhất.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="w-full border-2 border-gold text-gold font-heading font-semibold py-3 rounded-lg hover:bg-gold/5 transition-colors"
        >
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="sticky top-24 bg-white rounded-lg border border-gray-border shadow-card p-6 space-y-4">
      <div className="border-b border-gray-border pb-4">
        <div className="flex items-center gap-2 text-gold mb-2">
          <Calendar size={18} />
          <h2 className="font-heading font-bold text-navy text-lg">Đặt lịch tư vấn</h2>
        </div>
        <div className="text-2xl font-heading font-bold text-gold">{price}</div>
        <p className="text-gray-text text-sm mt-1">Q7 Saigon Riverside Complex</p>
      </div>

      <div>
        <Label htmlFor="detail-fullName" className="text-navy font-medium mb-1.5 block">
          Họ và tên <span className="text-red-500">*</span>
        </Label>
        <Input id="detail-fullName" name="fullName" placeholder="Nguyễn Văn A" required minLength={2} />
      </div>

      <div>
        <Label htmlFor="detail-phone" className="text-navy font-medium mb-1.5 block">
          Số điện thoại <span className="text-red-500">*</span>
        </Label>
        <Input id="detail-phone" name="phone" placeholder="0901 234 567" required minLength={9} />
      </div>

      <div>
        <Label htmlFor="detail-appointmentTime" className="text-navy font-medium mb-1.5 block">
          Thời gian hẹn
        </Label>
        <Input id="detail-appointmentTime" name="appointmentTime" type="datetime-local" />
      </div>

      <div>
        <Label htmlFor="detail-contactMethod" className="text-navy font-medium mb-1.5 block">
          Cách liên hệ
        </Label>
        <select
          id="detail-contactMethod"
          name="contactMethod"
          defaultValue="Gọi điện"
          className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option>Gọi điện</option>
          <option>Zalo</option>
          <option>SMS</option>
          <option>Email</option>
        </select>
      </div>

      <div>
        <Label htmlFor="detail-budget" className="text-navy font-medium mb-1.5 block">
          Ngân sách
        </Label>
        <Input id="detail-budget" name="budget" placeholder={listingType === "sell" ? "Ví dụ: 3 tỷ" : "Ví dụ: 15 triệu/tháng"} />
      </div>

      <div>
        <Label htmlFor="detail-note" className="text-navy font-medium mb-1.5 block">
          Ghi chú
        </Label>
        <Textarea id="detail-note" name="note" placeholder="Nhu cầu, thời gian có thể xem nhà..." rows={3} />
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
            Đang gửi...
          </>
        ) : (
          "Gửi yêu cầu tư vấn"
        )}
      </button>

      <p className="text-gray-text text-xs text-center">
        Thông tin này được gửi trực tiếp đến bộ phận tư vấn.
      </p>
    </form>
  );
}
