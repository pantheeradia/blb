import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    title: "Ground coffee",
    description: "Choose the grind. Keep the ritual.",
    href: "/shop?category=ground-coffee",
    image: "/images/GC_Beans_01.webp",
    className: "min-h-[520px] lg:row-span-2",
  },
  {
    title: "Instant premixes",
    description: "A proper cup in under a minute.",
    href: "/shop?category=instant-premix",
    image: "/images/DSC5479.webp",
    className: "min-h-[300px]",
  },
  {
    title: "Whole bean",
    description: "Roasted fresh for your grinder.",
    href: "/shop?category=whole-bean",
    image: "/images/DB_Beans_01.webp",
    className: "min-h-[300px]",
  },
];

export function ShopByCategory() {
  return (
    <section className="bg-[#f7f0e6] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b6a3c]">Find your daily cup</p>
            <h2 className="max-w-xl font-serif text-4xl leading-[1.03] tracking-[-0.025em] text-[#20110c] sm:text-5xl">
              Coffee for every kind of morning.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#765f4f]">
            Start with how you like to brew. We&apos;ll help with the roast, grind and flavour from there.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr] lg:grid-rows-2">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className={`reveal-on-scroll group relative overflow-hidden bg-[#27160f] ${category.className} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b6a3c]`}
            >
              <Image
                src={category.image}
                alt={`${category.title} from Bean Leaf Brew`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f100b]/90 via-[#1f100b]/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 text-[#fffaf2] sm:p-8">
                <div>
                  <h3 className="font-serif text-3xl tracking-[-0.02em] sm:text-4xl">{category.title}</h3>
                  <p className="mt-2 text-sm text-[#fffaf2]/70">{category.description}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#fffaf2]/45 transition-all duration-300 group-hover:border-[#d7a35f] group-hover:bg-[#d7a35f] group-hover:text-[#20110c]">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
