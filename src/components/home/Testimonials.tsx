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
    <section className="bg-[#ead9c8] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f5e35]">From the brew table</p>
          <h2 className="font-serif text-4xl leading-none tracking-[-0.025em] text-[#20110c] sm:text-5xl">Passed on, cup by cup.</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.35fr_0.65fr]">
          {testimonials.map((t, i) => (
            <figure
              key={t.author}
              className={`reveal-on-scroll flex flex-col justify-between bg-[#fffaf2] p-7 sm:p-9 ${i === 0 ? "md:row-span-2 lg:min-h-[410px]" : "min-h-[195px]"}`}
            >
              <div>
                <div className="mb-5 text-xs tracking-[0.16em] text-[#9b6a3c]" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote className={`font-serif leading-snug tracking-[-0.015em] text-[#2b1810] ${i === 0 ? "text-3xl sm:text-4xl" : "text-xl"}`}>
                  &ldquo;{t.text}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-7 border-t border-[#d8c7b3] pt-4">
                <p className="text-xs font-semibold text-[#20110c]">{t.author}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#8b6b57]">{t.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
