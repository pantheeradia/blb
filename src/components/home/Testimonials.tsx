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
    <section className="bg-[#ead9c8] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 max-w-xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f5e35]">From the brew table</p>
          <h2 className="font-serif text-4xl leading-none tracking-[-0.025em] text-[#20110c] sm:text-5xl">What our customers say.</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.author}
              className={`reveal-on-scroll flex min-h-[260px] flex-col rounded-xl border border-[#e4d3bf] bg-[#fffaf2] p-6 sm:p-7 lg:min-h-[280px] ${i === 0 ? "md:col-span-2 md:min-h-0 lg:col-span-1 lg:min-h-[280px]" : ""}`}
            >
              <div>
                <div className="mb-5 text-xs tracking-[0.16em] text-[#9b6a3c]" aria-label="5 out of 5 stars">★★★★★</div> {/* taste-skill-ignore: familiar visual shorthand for the customer rating */}
                <blockquote className="font-serif text-2xl leading-[1.18] tracking-[-0.02em] text-[#2b1810] lg:text-2xl">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-7 border-t border-[#e4d3bf] pt-4 lg:mt-auto">
                <p className="text-sm font-semibold text-[#20110c]">{t.author}</p>
                <p className="mt-1 text-xs text-[#8b6b57]">{t.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
