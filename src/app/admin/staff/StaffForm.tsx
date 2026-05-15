"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStaff, updateStaff } from "@/app/actions/staff";

export type StaffFormInitialData = {
  id: string;
  name: string;
  role: string;
  phone: string;
  zalo: string | null;
  image: string | null;
  color: string;
  speciality: string | null;
  order: number;
};

export default function StaffForm({ initialData = null }: { initialData?: StaffFormInitialData | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      phone: formData.get("phone") as string,
      zalo: formData.get("zalo") as string || null,
      image: formData.get("image") as string || null,
      color: formData.get("color") as string,
      speciality: formData.get("speciality") as string || null,
      order: parseInt(formData.get("order") as string) || 0,
    };

    startTransition(async () => {
      let res;
      if (initialData?.id) {
        res = await updateStaff(initialData.id, data);
      } else {
        res = await createStaff(data);
      }

      if (res.success) {
        toast.success(initialData?.id ? "Cập nhật thành công!" : "Tạo mới thành công!");
        router.push("/admin/staff");
        router.refresh();
      } else {
        toast.error(res.error || "Có lỗi xảy ra");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-border p-6 lg:p-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <label className="block text-sm font-medium text-navy mb-2">Họ và Tên *</label>
          <input 
            type="text" 
            name="name" 
            required 
            defaultValue={initialData?.name}
            className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors"
            placeholder="VD: Nguyễn Văn A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-2">Chức vụ *</label>
          <input 
            type="text" 
            name="role" 
            required 
            defaultValue={initialData?.role}
            className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors"
            placeholder="VD: Chuyên viên Tư vấn"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-2">Số điện thoại *</label>
          <input 
            type="text" 
            name="phone" 
            required 
            defaultValue={initialData?.phone}
            className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-2">Số Zalo</label>
          <input 
            type="text" 
            name="zalo" 
            defaultValue={initialData?.zalo ?? ""}
            className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-2">Chuyên môn / Điểm mạnh</label>
          <input 
            type="text" 
            name="speciality" 
            defaultValue={initialData?.speciality ?? ""}
            className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors"
            placeholder="VD: Chuyên phân khu The Rainbow, The Origami"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-2">Đường dẫn Ảnh đại diện (Local path)</label>
          <input 
            type="text" 
            name="image" 
            defaultValue={initialData?.image ?? ""}
            className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors"
            placeholder="VD: /images/staff/{staff-id}/avatar.webp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-2">Thứ tự hiển thị</label>
          <input 
            type="number" 
            name="order" 
            defaultValue={initialData?.order || 0}
            className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-2">Màu nền Avatar (Gradient Class) *</label>
          <select 
            name="color" 
            defaultValue={initialData?.color || "from-navy to-navy-light"}
            className="w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold bg-white"
          >
            <option value="from-navy to-navy-light">Xanh Navy (Mặc định)</option>
            <option value="from-gold to-gold-light">Vàng Gold</option>
            <option value="from-blue-600 to-blue-400">Xanh dương nhạt</option>
            <option value="from-emerald-600 to-emerald-400">Xanh lá</option>
            <option value="from-purple-600 to-purple-400">Tím</option>
            <option value="from-orange-500 to-orange-400">Cam</option>
            <option value="from-gray-700 to-gray-500">Xám</option>
          </select>
        </div>

      </div>

      <div className="mt-8 flex items-center justify-end gap-4 border-t border-gray-border pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg border border-gray-border text-gray-text font-medium hover:bg-gray-50 transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={`bg-navy hover:bg-navy-light text-white px-8 py-2.5 rounded-lg font-medium transition-colors ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isPending ? "Đang lưu..." : initialData?.id ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
}
