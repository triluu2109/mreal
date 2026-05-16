import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Award, Heart, Home, Shield, Star, TrendingUp, Users } from "lucide-react";
import vi from "@/locales/vi.json";
import { resolveStorageUrl } from "@/server/storage/resolve-url";

// Confirmed path in storage.objects
const HERO_BG = resolveStorageUrl("projects/q7-saigon-riverside/hinh-anh-du-an/anh-chup-thuc-te-du-an-bang-flycam.webp");

export const metadata: Metadata = {
  title: vi.about_page.meta.title,
  description: vi.about_page.meta.description,
};

const SHOW_TEAM_SECTION = false;



const values = [
  { icon: Shield, title: vi.about_page.values.items[0].title, desc: vi.about_page.values.items[0].desc },
  { icon: Heart, title: vi.about_page.values.items[1].title, desc: vi.about_page.values.items[1].desc },
  { icon: Award, title: vi.about_page.values.items[2].title, desc: vi.about_page.values.items[2].desc },
  { icon: TrendingUp, title: vi.about_page.values.items[3].title, desc: vi.about_page.values.items[3].desc },
];

const milestones = vi.about_page.timeline.events;

export default function GioiThieuPage() {
  return (
    <>
      <Header />
      <main>
        <section
          className="relative overflow-hidden bg-navy py-20 text-center text-white sm:py-28"
          style={{ backgroundImage: `url('${HERO_BG}')`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          {/* Heavy navy overlay — low transparency = more blue = stronger contrast */}
          <div className="absolute inset-0 bg-navy/85" />
          {/* Subtle gold radial accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(180,144,68,0.15)_0%,_transparent_60%)]" />

          <div className="container-site relative z-10">
            <span className="mb-5 inline-block rounded-full border border-gold/30 bg-gold/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
              {vi.about_page.hero.label}
            </span>
            <h1 className="font-heading text-3xl font-bold text-white md:text-5xl">
              {vi.about_page.hero.title}<br />
              <span className="text-gold">{vi.about_page.hero.title_highlight}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
              {vi.about_page.hero.desc}
            </p>
          </div>
        </section>



        <section className="bg-gray-bg py-12 sm:py-14">
          <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <span className="section-label mb-3 block">{vi.about_page.story.label}</span>
              <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
                {vi.about_page.story.title} <span className="text-gold">{vi.about_page.story.title_highlight}</span>
              </h2>
              <div className="mt-5 space-y-4 leading-7 text-gray-text">
                <p>{vi.about_page.story.p1}</p>
                <p>{vi.about_page.story.p2}</p>
                <p>{vi.about_page.story.p3}</p>
              </div>
            </div>
            <div>
              <h3 className="mb-6 font-heading text-lg font-bold text-navy">{vi.about_page.timeline.title}</h3>
              <div className="space-y-5 border-l-2 border-gold/30 pl-6">
                {milestones.map((item, index) => (
                  <div key={`${item.year}-${index}`} className="relative">
                    <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-gold bg-white" />
                    <span className="font-heading text-sm font-bold text-gold">{item.year}</span>
                    <p className="mt-1 text-sm leading-6 text-gray-text">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-14">
          <div className="container-site">
            <div className="mb-9 text-center">
              <span className="section-label mb-3 block">{vi.about_page.values.label}</span>
              <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
                {vi.about_page.values.title} <span className="text-gold">{vi.about_page.values.title_highlight}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="group relative rounded-2xl bg-gray-bg border border-transparent p-6 text-center transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Gold accent line on top */}
                  <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  {/* Icon */}
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 transition-colors duration-300 group-hover:bg-gold/20">
                    <item.icon size={24} className="text-gold transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="font-heading text-lg font-bold text-navy transition-colors duration-300 group-hover:text-gold">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-text">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {SHOW_TEAM_SECTION ? <section className="bg-gray-bg py-12" /> : null}


      </main>
      <Footer />
    </>
  );
}
