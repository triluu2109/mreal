"use client";

import { useState, useTransition } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/app/actions/contact";
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function ContactClient() {
  const { dict: vi } = useI18n();
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitContact(formData);
      if (result.success) setSuccess(true);
    });
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-dark via-navy to-navy-light pt-24 pb-12">
          <div className="container-site text-center">
            <span className="section-label">{vi.contact_page.hero.label}</span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mt-3 mb-3">
              {vi.contact_page.hero.title} <span className="text-gradient-gold">{vi.contact_page.hero.title_highlight}</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              {vi.contact_page.hero.desc}
            </p>
          </div>
        </section>

        {/* Contact content */}
        <section className="section-padding bg-gray-bg">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Info side */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-7 border border-gray-border">
                  <h2 className="font-heading font-bold text-navy text-xl mb-6">{vi.contact_page.info_title}</h2>
                  <div className="space-y-5">
                    {[
                      { icon: MapPin, label: vi.contact_page.info.address, value: siteConfig.address },
                      { icon: Phone, label: "Hotline", value: siteConfig.phoneDisplay, href: `tel:${siteConfig.phone}` },
                      { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
                      { icon: Clock, label: vi.contact_page.info.hours, value: vi.contact_page.info.hours_value },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center shrink-0">
                          <item.icon size={18} className="text-white" />
                        </div>
                        <div>
                          <div className="text-gold text-xs font-semibold uppercase tracking-wider mb-0.5">
                            {item.label}
                          </div>
                          {item.href ? (
                            <a href={item.href} className="text-navy font-medium hover:text-gold transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-navy font-medium whitespace-pre-line">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form side */}
              <div className="lg:col-span-3">
                {success ? (
                  <div className="bg-white rounded-2xl p-12 border border-gray-border text-center">
                    <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-navy text-2xl mb-3">{vi.contact_page.success_title}</h3>
                    <p className="text-gray-text mb-6">
                      {vi.contact_page.success_desc}
                    </p>
                    <button onClick={() => setSuccess(false)} className="btn-gold px-8">
                      {vi.contact_page.send_another}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-border space-y-5">
                    <h2 className="font-heading font-bold text-navy text-xl mb-2">
                      {vi.contact_page.form_title}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName" className="text-navy font-medium mb-1.5 block">
                          {vi.common.full_name} <span className="text-red-500">*</span>
                        </Label>
                        <Input id="fullName" name="fullName" placeholder={vi.home.booking.full_name_placeholder} required />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-navy font-medium mb-1.5 block">
                          {vi.common.phone_number} <span className="text-red-500">*</span>
                        </Label>
                        <Input id="phone" name="phone" placeholder={vi.home.booking.phone_placeholder} required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-navy font-medium mb-1.5 block">{vi.common.email}</Label>
                      <Input id="email" name="email" type="email" placeholder="email@example.com" />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-navy font-medium mb-1.5 block">
                        {vi.contact_page.message_label} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={vi.contact_page.message_placeholder}
                        rows={5}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn-gold w-full py-3.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <><Loader2 size={18} className="animate-spin" /> {vi.common.loading_send}</>
                      ) : (
                        vi.contact_page.submit
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
