import { Coffee, PackageCheck, Sprout, Timer } from "lucide-react";

const values = [
  { icon: Sprout, title: "Estate sourced", text: "Coffee from Coorg and Chikmagalur" },
  { icon: Coffee, title: "Profile roasted", text: "Balanced for every brew method" },
  { icon: PackageCheck, title: "Packed fresh", text: "Sealed quickly to hold the aroma" },
  { icon: Timer, title: "Brew it your way", text: "Whole bean, ground or instant" },
];

export function ValueStrip() {
  return (
    <section aria-label="Why choose Bean Leaf Brew" className="border-y border-[#d8c7b3] bg-[#fffaf2]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 md:grid-cols-4">
        {values.map(({ icon: Icon, title, text }, index) => (
          <div
            key={title}
            className={`flex gap-3 py-6 pr-4 md:px-6 ${index % 2 === 1 ? "border-l border-[#d8c7b3] pl-4" : ""} ${index >= 2 ? "border-t border-[#d8c7b3] md:border-t-0" : ""} ${index > 0 ? "md:border-l md:border-[#d8c7b3]" : ""}`}
          >
            <Icon size={20} strokeWidth={1.45} className="mt-0.5 shrink-0 text-[#9b6a3c]" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#20110c]">{title}</p>
              <p className="mt-1 hidden text-xs leading-5 text-[#765f4f] sm:block">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
