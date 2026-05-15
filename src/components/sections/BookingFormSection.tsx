"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitAppointment } from "@/app/actions/appointment";

const schema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  need: z.string().optional(),
  budget: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BookingFormSection() {
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v) formData.append(k, v);
      });
      const result = await submitAppointment(formData);
      if (result.success) {
        setSuccess(true);
        reset();
      }
    });
  };

  return (
    <section className="section-padding bg-gray-bg" id="booking">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left info */}
          <div>
            <span className="section-label">Đặt lịch tư vấn</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-3 mb-6">
              Nhận tư vấn{" "}
              <span className="text-orange">miễn phí</span>
              <br />
              ngay hôm nay
            </h2>
            <p className="text-gray-text text-lg leading-relaxed mb-8">
              Điền thông tin bên dưới, chuyên viên của chúng tôi sẽ liên hệ lại
              trong vòng <strong className="text-[#1A1A1A]">30 phút</strong> để tư vấn
              chi tiết và sắp xếp lịch hẹn.
            </p>

            <div className="space-y-5">
              {[
                { icon: "🎯", title: "Tư vấn đúng nhu cầu", desc: "Chúng tôi lắng nghe và đề xuất giải pháp phù hợp nhất" },
                { icon: "⚡", title: "Phản hồi nhanh chóng", desc: "Chuyên viên liên hệ trong vòng 30 phút làm việc" },
                { icon: "🔒", title: "Bảo mật thông tin", desc: "Thông tin cá nhân được bảo mật tuyệt đối" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <div className="font-heading font-semibold text-[#1A1A1A]">{item.title}</div>
                    <div className="text-gray-text text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div>
            {success ? (
              <div className="bg-white rounded-3xl p-10 shadow-md text-center border border-gray-border">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-[#1A1A1A] text-2xl mb-3">
                  Đặt lịch thành công!
                </h3>
                <p className="text-gray-text mb-6">
                  Cảm ơn bạn đã liên hệ. Chuyên viên sẽ gọi lại trong vòng 30 phút.
                </p>
                <button onClick={() => setSuccess(false)} className="btn-gold px-8">
                  Đặt lịch khác
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-3xl p-8 shadow-md border border-gray-border space-y-5"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-gray-border">
                  <Calendar size={22} className="text-orange" />
                  <h3 className="font-heading font-bold text-[#1A1A1A] text-lg">Thông tin đặt lịch</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="fullName" className="text-[#1A1A1A] font-medium mb-1.5 block">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      {...register("fullName")}
                      className={errors.fullName ? "border-red-400" : ""}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="phone" className="text-[#1A1A1A] font-medium mb-1.5 block">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="0901 234 567"
                      {...register("phone")}
                      className={errors.phone ? "border-red-400" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="need" className="text-[#1A1A1A] font-medium mb-1.5 block">
                    Nhu cầu thuê / mua
                  </Label>
                  <Input
                    id="need"
                    placeholder="Ví dụ: Muốn thuê căn 2PN, hoặc mua đầu tư..."
                    {...register("need")}
                  />
                </div>

                <div>
                  <Label htmlFor="budget" className="text-[#1A1A1A] font-medium mb-1.5 block">
                    Tài chính dự kiến
                  </Label>
                  <Input
                    id="budget"
                    placeholder="Ví dụ: Khoảng 3 tỷ, hoặc 12 triệu/tháng..."
                    {...register("budget")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-gold w-full py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <><Loader2 size={18} className="animate-spin" /> Đang gửi...</>
                  ) : (
                    "Đặt lịch tư vấn ngay"
                  )}
                </button>

                <p className="text-gray-text text-xs text-center">
                  Bằng cách gửi form, bạn đồng ý để M-Real Estate liên hệ tư vấn.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
