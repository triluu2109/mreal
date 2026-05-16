"use client";

import { useActionState } from "react";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { loginAdmin } from "./actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-navy">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" size={17} />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-gray-border bg-white py-3.5 pl-11 pr-4 text-sm text-navy outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
            placeholder="admin@mreal.vn"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-navy">
          Mat khau
        </label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" size={17} />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-gray-border bg-white py-3.5 pl-11 pr-4 text-sm text-navy outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
            placeholder="Nhap mat khau"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3.5 text-sm font-bold text-white shadow-navy transition hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? <Loader2 size={18} className="animate-spin" /> : <LockKeyhole size={18} />}
        Dang nhap admin
      </button>
    </form>
  );
}
