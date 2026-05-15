"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Eye, EyeOff, Star } from "lucide-react";
import { toast } from "sonner";
import { toggleRentalListingFeatured, toggleRentalListingVisibility } from "@/app/actions/rent";
import { toggleSaleListingFeatured, toggleSaleListingVisibility } from "@/app/actions/sell";

type ListingKind = "rent" | "sell";
type ToggleField = "visible" | "featured";

type Props = {
  id: string;
  kind: ListingKind;
  field: ToggleField;
  value: boolean;
};

export default function ListingToggleButton({ id, kind, field, value }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isVisibleToggle = field === "visible";
  const Icon = isVisibleToggle ? (value ? EyeOff : Eye) : Star;
  const label = isVisibleToggle
    ? value ? "Ẩn khỏi giỏ hàng" : "Hiện lên giỏ hàng"
    : value ? "Bỏ nổi bật" : "Đánh dấu nổi bật";

  function onClick() {
    startTransition(async () => {
      const nextValue = !value;
      const result = kind === "rent"
        ? isVisibleToggle
          ? await toggleRentalListingVisibility(id, nextValue)
          : await toggleRentalListingFeatured(id, nextValue)
        : isVisibleToggle
          ? await toggleSaleListingVisibility(id, nextValue)
          : await toggleSaleListingFeatured(id, nextValue);

      if (result.success) {
        toast.success("Đã cập nhật trạng thái");
        router.refresh();
      } else {
        toast.error(result.error || "Không thể cập nhật trạng thái");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
        isVisibleToggle
          ? "bg-slate-50 text-slate-600 hover:bg-slate-100"
          : value
            ? "bg-gold/10 text-gold hover:bg-gold/20"
            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} fill={!isVisibleToggle && value ? "currentColor" : "none"} />
    </button>
  );
}
