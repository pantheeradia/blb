import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    text: "Best green coffee I've had. The flavour is clean, earthy, and incredibly fresh. You can tell it's roasted in small batches.",
    author: "Priya K.",
    location: "Bangalore",
  },
  {
    text: "Their hazelnut premix is my morning ritual now. Ready in under a minute and tastes better than café coffee.",
    author: "Arjun M.",
    location: "Whitefield",
  },
  {
    text: "Fast delivery and the beans are always freshly roasted. The Golden Crema makes perfect espresso at home.",
    author: "Sneha R.",
    location: "HSR Layout",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="scroll-mt-20 border-b border-[#e7dfd4] bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 lg:flex-row lg:items-end lg:gap-12">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#795b42]">From the brew table</p>
            <h2 id="testimonials-heading" className="max-w-xl font-serif text-3xl leading-tight tracking-[-0.03em] text-[#2c211b] sm:text-[42px]">What our customers say.</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[#6e635a]">A few words from the people who make us part of their day.</p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:gap-6">
          {testimonials.map((testimonial, index) => {
            const featured = index === 0;
            const initials = testimonial.author.split(" ").map((part) => part[0]).join("");
            return (
              <figure key={testimonial.author} className={cn("m-0 flex flex-col rounded-2xl border p-6 sm:p-7", featured ? "border-[#2c211b] bg-[#2c211b] text-[#fffaf2] md:col-span-2 lg:col-span-1" : "border-[#e5ddd2] bg-white text-[#2c211b]")}>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className={cn("flex gap-1", featured ? "text-[#ddb57c]" : "text-[#92653e]")} role="img" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }, (_, star) => <Star key={star} size={12} fill="currentColor" strokeWidth={1} aria-hidden="true" />)}
                  </div>
                  <Quote size={27} strokeWidth={1.2} aria-hidden="true" className={featured ? "text-[#a38b71]" : "text-[#b6a18c]"} />
                </div>
                <blockquote className="mb-8 text-[16px] leading-[1.85] tracking-[-0.01em] sm:text-[17px]">{testimonial.text}</blockquote>
                <figcaption className={cn("mt-auto flex items-center gap-3 border-t pt-5", featured ? "border-[#ffffff]/15" : "border-[#ebe5dc]")}>
                  <span aria-hidden="true" className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tracking-wider", featured ? "bg-[#ffffff]/10 text-[#edddc5]" : "bg-[#f1ebe2] text-[#73573f]")}>{initials}</span>
                  <div>
                    <p className="text-xs font-semibold">{testimonial.author}</p>
                    <p className={cn("mt-1 text-[11px]", featured ? "text-[#cabcab]" : "text-[#75685d]")}>{testimonial.location}</p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
