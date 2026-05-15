import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NewsDetailLoading() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-navy pt-12">
          <div className="container-site max-w-5xl pb-10">
            <div className="h-4 w-56 rounded bg-white/15" />
            <div className="mt-8 h-10 max-w-3xl rounded bg-white/15" />
            <div className="mt-4 h-5 max-w-2xl rounded bg-white/10" />
          </div>
        </section>
        <div className="container-site max-w-5xl -mt-6">
          <div className="aspect-[16/9] rounded-2xl bg-gray-bg shadow-xl" />
        </div>
        <section className="section-padding">
          <div className="container-site max-w-3xl space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-4 rounded bg-gray-bg" />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
