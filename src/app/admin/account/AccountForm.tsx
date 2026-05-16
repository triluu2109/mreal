"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateOwnProfile } from "@/app/actions/staff";

export default function AccountForm({
  fullName,
  phone,
  email,
  role,
}: {
  fullName: string;
  phone: string | null;
  email: string;
  role: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? "") || null,
      password: String(formData.get("password") ?? "") || null,
    };

    startTransition(async () => {
      const result = await updateOwnProfile(data);
      if (result.success) toast.success("Đã cập nhật tài khoản");
      else toast.error(result.error || "Không cập nhật được tài khoản");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-navy mb-2">Email</label>
          <input value={email} disabled className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-2">Vai trò</label>
          <input value={role} disabled className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-2">Họ và tên</label>
          <input name="fullName" required defaultValue={fullName} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-2">Số điện thoại</label>
          <input name="phone" defaultValue={phone ?? ""} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-2">Mật khẩu mới</label>
          <input name="password" type="password" minLength={8} className={inputClass} placeholder="Để trống nếu không đổi" />
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-gray-border pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-70"
        >
          {isPending ? "Đang lưu..." : "Cập nhật"}
        </button>
      </div>
    </form>
  );
}

const inputClass = "w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors bg-white disabled:bg-gray-bg disabled:text-gray-muted";
