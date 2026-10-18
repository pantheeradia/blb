import { Coffee } from "lucide-react";

export function ComingSoonBanner() {
  return (
    <div className="bg-[#FAFAF8] border border-[#D4C4B0] rounded-lg p-12 md:p-16 text-center">
      <div className="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto">
        {/* Coffee Icon */}
        <div className="text-[#1A0E08]">
          <Coffee size={48} strokeWidth={1.5} />
        </div>

        {/* Brand Label */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9953C]">
          BEAN LEAF BREW
        </p>

        {/* Main Heading */}
        <h2 className="font-serif text-2xl md:text-3xl text-[#1A0E08]">
          Something Good Is Brewing
        </h2>

        {/* Supporting Text */}
        <p className="text-sm text-[#8B5E3C] leading-relaxed">
          Our Instant Premix collection is getting ready. Your favourite flavours will be back soon!
        </p>

        {/* Status Label */}
        <div className="inline-block">
          <span className="text-[10px] uppercase tracking-widest text-[#1A0E08] border-2 border-[#1A0E08] px-6 py-2">
            COMING SOON
          </span>
        </div>

        {/* Closing Line */}
        <p className="text-xs text-[#8B5E3C] italic">
          A little patience. A lot of flavour.
        </p>
      </div>
    </div>
  );
}
