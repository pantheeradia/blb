import Image from "next/image";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import TimelineBlock01 from "@/components/ui/timeline-01";
import { HoyyaEducation } from "@/components/home/HoyyaEducation";

export const metadata = {
  title: "About - Bean Leaf Brew",
  description: "The story behind Bean Leaf Brew — artisan coffee from Whitefield, Bengaluru.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen bg-[#F7F0E6] pt-20">
        <section className="relative h-72 bg-[#1A0E08] flex items-end overflow-hidden">
          <Image
            src="/images/DB_Beans_01.webp"
            alt="Freshly roasted coffee beans"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-55"
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9953C] mb-2">Our Story</p>
            <h1 className="font-serif text-3xl md:text-5xl text-[#F7F0E6]">About Us</h1>
          </div>
        </section>

        <TimelineBlock01 />

        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
            {[
              { stat: "3,100 – 4,000 ft", label: "Estate Altitude" },
              { stat: "100%", label: "Freshly Roasted" },
              { stat: "Coorg & Chikmagalur", label: "Source Regions" },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-[#EAD9C8] px-6 py-8">
                <p className="font-serif text-2xl text-[#1A0E08] mb-1">{stat}</p>
                <p className="text-xs uppercase tracking-widest text-[#8B5E3C]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <HoyyaEducation />
      </main>
      <Footer />
    </>
  );
}
