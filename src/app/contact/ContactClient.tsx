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

export default function ContactClient() {
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
        <section className="bg-gradient-to-br from-navy-dark via-navy to-navy-light pt-32 pb-20">
          <div className="container-site text-center">
            <span className="section-label">Liên hệ</span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              Liên hệ với <span className="text-gradient-gold">chúng tôi</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Chúng tôi sẵn sàng tư vấn miễn phí và hỗ trợ bạn 24/7.
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
                  <h2 className="font-heading font-bold text-navy text-xl mb-6">Thông tin liên hệ</h2>
                  <div className="space-y-5">
                    {[
                      { icon: MapPin, label: "Địa chỉ", value: siteConfig.address },
                      { icon: Phone, label: "Hotline", value: siteConfig.phoneDisplay, href: `tel:${siteConfig.phone}` },
                      { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
                      { icon: Clock, label: "Giờ làm việc", value: "T2–T7: 8:00–17:30\nCN: 8:00–12:00" },
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

                {/* Map */}
                <div className="rounded-2xl overflow-hidden border border-gray-border h-56">
                  <iframe
                    src={siteConfig.mapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="M-Real Estate map"
                  />
                </div>
              </div>

              {/* Form side */}
              <div className="lg:col-span-3">
                {success ? (
                  <div className="bg-white rounded-2xl p-12 border border-gray-border text-center">
                    <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-navy text-2xl mb-3">Gửi thành công!</h3>
                    <p className="text-gray-text mb-6">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                    </p>
                    <button onClick={() => setSuccess(false)} className="btn-gold px-8">
                      Gửi tin nhắn khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-border space-y-5">
                    <h2 className="font-heading font-bold text-navy text-xl mb-2">
                      Gửi tin nhắn cho chúng tôi
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName" className="text-navy font-medium mb-1.5 block">
                          Họ và tên <span className="text-red-500">*</span>
                        </Label>
                        <Input id="fullName" name="fullName" placeholder="Nguyễn Văn A" required />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-navy font-medium mb-1.5 block">
                          Số điện thoại <span className="text-red-500">*</span>
                        </Label>
                        <Input id="phone" name="phone" placeholder="0901 234 567" required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-navy font-medium mb-1.5 block">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="email@example.com" />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-navy font-medium mb-1.5 block">
                        Nội dung <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Vui lòng nhập câu hỏi hoặc yêu cầu của bạn..."
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
                        <><Loader2 size={18} className="animate-spin" /> Đang gửi...</>
                      ) : (
                        "Gửi tin nhắn"
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
