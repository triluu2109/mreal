import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Building2, ShieldCheck, Sparkles } from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin/auth";
import LoginForm from "./LoginForm";
import { siteImages } from "@/config/images";

export const metadata: Metadata = { title: "Đăng nhập Admin | M-Real Estate" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f2] text-navy">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px]">
        <section className="relative hidden bg-navy px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_38%),radial-gradient(circle_at_80%_15%,rgba(201,151,29,0.24),transparent_28%)]" />
          <div className="relative z-10">
            <div className="inline-flex rounded-xl bg-white px-5 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
              <Image
                src={siteImages.logo.rectangle}
                alt="M-Real Estate"
                width={200}
                height={60}
                priority
                className="h-20 w-auto"
                style={{ width: "auto" }}
              />
            </div>
          </div>

          <div className="relative z-10 max-w-2xl pb-8">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
              <Sparkles size={14} />
              Premium admin workspace
            </div>
            <h1 className="max-w-xl font-heading text-5xl font-bold leading-tight text-white">
              Quản trị vận hành bất động sản với độ tin cậy cao.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/68">
              Không gian làm việc dành cho đội ngũ M-Real Estate quản lý giỏ hàng, khách hàng,
              lịch hẹn, tin tức và phân quyền nội bộ.
            </p>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                ["Secure", "Supabase Auth"],
                ["Roles", "Master/Admin/Staff"],
                ["Audit", "Server guards"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/8 p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</div>
                  <div className="mt-2 text-sm font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy via-gold to-navy lg:hidden" />
          <div className="w-full max-w-md animate-fade-in">
            <div className="mb-8 flex justify-center lg:hidden">
              <Image
                src="/logo/m-real-estate-premium-logo.svg"
                alt="M-Real Estate"
                width={200}
                height={60}
                priority
                className="h-12 w-auto"
              />
            </div>

            <div className="rounded-xl border border-gray-border bg-white p-7 shadow-[0_24px_80px_rgba(29,46,111,0.10)] sm:p-8">
              <div className="mb-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white shadow-navy">
                  <ShieldCheck size={24} />
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Admin access
                </p>
                <h2 className="font-heading text-3xl font-bold text-navy">Đăng nhập</h2>
                <p className="mt-3 text-sm leading-6 text-gray-text">
                  Sử dụng email và mật khẩu được cấp quyền để truy cập hệ thống quản trị.
                </p>
              </div>
              <LoginForm />
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-muted">
              <Building2 size={14} className="text-gold" />
              <span>Không gian làm việc nội bộ M-Real Estate</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
