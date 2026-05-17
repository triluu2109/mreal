"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2, Calendar, Target, Zap, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitAppointment } from "@/app/actions/appointment";
import { useI18n } from "@/components/i18n/I18nProvider";

const baseSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  need: z.string().optional(),
  budget: z.string().optional(),
});

type FormValues = z.infer<typeof baseSchema>;

export default function BookingFormSection() {
  const { dict: vi } = useI18n();
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const schema = baseSchema.extend({
    fullName: z.string().min(2, vi.home.booking.validation.full_name),
    phone: z.string().min(9, vi.home.booking.validation.phone),
  });

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
            <span className="section-label">{vi.home.booking.label}</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mt-3 mb-6">
              {vi.home.booking.title}{" "}
              <span className="text-orange">{vi.home.booking.title_highlight}</span>
              <br />
              {vi.home.booking.title_suffix}
            </h2>
            <p className="text-gray-text text-lg leading-relaxed mb-8">
              {vi.home.booking.desc_prefix} <strong className="text-navy">{vi.home.booking.desc_emphasis}</strong> {vi.home.booking.desc_suffix}
            </p>

            <div className="space-y-5">
              {vi.home.booking.benefits.map((benefit, index) => ({ icon: [Target, Zap, ShieldCheck][index], ...benefit })).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-orange/10 text-orange flex-shrink-0 mt-0.5">
                      <Icon size={20} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="font-heading font-semibold text-navy">{item.title}</div>
                      <div className="text-gray-text text-sm mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right form */}
          <div>
            {success ? (
              <div className="bg-white rounded-3xl p-10 shadow-md text-center border border-gray-border">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-navy text-2xl mb-3">
                  {vi.home.booking.success_title}
                </h3>
                <p className="text-gray-text mb-6">
                  {vi.home.booking.success_desc}
                </p>
                <button onClick={() => setSuccess(false)} className="btn-gold px-8">
                  {vi.home.booking.success_reset}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-3xl p-8 shadow-md border border-gray-border space-y-5"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-gray-border">
                  <Calendar size={22} className="text-orange" />
                  <h3 className="font-heading font-bold text-navy text-lg">{vi.home.booking.form_title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="fullName" className="text-[#1A1A1A] font-medium mb-1.5 block">
                      {vi.common.full_name} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder={vi.home.booking.full_name_placeholder}
                      {...register("fullName")}
                      className={errors.fullName ? "border-red-400" : ""}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="phone" className="text-[#1A1A1A] font-medium mb-1.5 block">
                      {vi.common.phone_number} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder={vi.home.booking.phone_placeholder}
                      {...register("phone")}
                      className={errors.phone ? "border-red-400" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="need" className="text-[#1A1A1A] font-medium mb-1.5 block">
                    {vi.home.booking.need_label}
                  </Label>
                  <Input
                    id="need"
                    placeholder={vi.home.booking.need_placeholder}
                    {...register("need")}
                  />
                </div>

                <div>
                  <Label htmlFor="budget" className="text-[#1A1A1A] font-medium mb-1.5 block">
                    {vi.home.booking.budget_label}
                  </Label>
                  <Input
                    id="budget"
                    placeholder={vi.home.booking.budget_placeholder}
                    {...register("budget")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-gold w-full py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <><Loader2 size={18} className="animate-spin" /> {vi.common.loading_send}</>
                  ) : (
                    vi.home.booking.submit
                  )}
                </button>

                <p className="text-gray-text text-xs text-center">
                  {vi.home.booking.consent}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
