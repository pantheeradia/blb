import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact - Bean Leaf Brew",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 sm:px-8 sm:py-16">
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9953C] mb-2">Get in Touch</p>
            <h1 className="font-serif text-3xl md:text-5xl text-[#1A0E08]">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <div className="space-y-6 text-sm text-[#4A2512]">
                <div>
                  <p id="location" className="scroll-mt-28 text-[10px] uppercase tracking-widest text-[#8B5E3C] mb-1">Address</p>
                  <p className="leading-relaxed">
                    Prime Square, Unit 303, 3rd Floor,<br/>
                    Whitefield Main Road,<br/>
                    Bengaluru Urban 560066, Karnataka
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8B5E3C] mb-1">Phone</p>
                  <a href="tel:+918123273344" className="inline-flex min-h-11 items-center underline decoration-[#b99d7e] underline-offset-4 hover:text-[#8f5e3b]">+91 8123273344</a>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8B5E3C] mb-1">Orders & Support</p>
                  <a href="mailto:hello@beanleafbrew.com" className="inline-flex min-h-11 items-center break-all underline decoration-[#b99d7e] underline-offset-4 hover:text-[#8f5e3b]">hello@beanleafbrew.com</a>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8B5E3C] mb-1">Hours</p>
                  <p>Monday – Saturday<br/>9:00 AM – 6:00 PM IST</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#e2d5c4] bg-[#fffcf7] p-6 md:col-span-3 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
