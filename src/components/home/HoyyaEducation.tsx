import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronDown, Coffee, CupSoda, Leaf, ListChecks, ScanLine, Sprout } from "lucide-react";
import { HOYYA_EDUCATION } from "@/data/hoyyaEducation";
import { collectionHref } from "@/lib/storefrontCategories";
import { cn } from "@/lib/utils";

const themes = {
  tea: { background: "bg-[#f2dfc8]", ink: "text-[#8b4e2d]", circle: "bg-[#e5c3a0]", Icon: Coffee, motif: "LEAVES / BLENDS / FLAVOUR", number: "01" },
  protein: { background: "bg-[#e9e0ea]", ink: "text-[#6b5275]", circle: "bg-[#d5c4d9]", Icon: CupSoda, motif: "SOURCE / SERVING / KNOW-HOW", number: "02" },
  matcha: { background: "bg-[#e4e8d4]", ink: "text-[#59613b]", circle: "bg-[#cad3ac]", Icon: Leaf, motif: "GREEN TEA / POWDER / RITUAL", number: "03" },
};

export function HoyyaEducation() {
  return (
    <section id="discover-hoyya" aria-labelledby="hoyya-heading" className="overflow-hidden border-y border-[#e0d5c4] bg-[#faf6ee] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <header className="mb-9 grid gap-6 lg:mb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b6545]"><Sprout size={15} strokeWidth={1.5} aria-hidden="true" /> Get to know HOYYA</p>
            <h2 id="hoyya-heading" className="font-serif text-4xl leading-[1.1] tracking-[-0.035em] text-[#302016] sm:text-5xl">A little know-how.<br />A ritual that&apos;s yours.</h2>
          </div>
          <div className="max-w-md lg:justify-self-end">
            <p className="text-sm leading-7 text-[#76604c]">Meet HOYYA: tea, protein and matcha. Explore the categories, understand the ingredients, and find what fits your everyday ritual.</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d9cbb8] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#785b40]"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#8b9a62]" /> The range is coming soon</span>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {HOYYA_EDUCATION.map((category) => {
            const theme = themes[category.theme];
            const Icon = theme.Icon;
            return (
              <article key={category.slug} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e0d5c4] bg-[#fffcf6]">
                <div className={cn("relative flex min-h-[240px] flex-col overflow-hidden p-6 sm:min-h-[270px]", theme.background, theme.ink)}>
                  <div className="relative z-10 flex items-start justify-between">
                    <p className="text-lg font-bold tracking-[0.12em]">HOYYA<span className="ml-2 text-[10px] font-medium tracking-normal">{category.name.replace("HOYYA ", "")}</span></p>
                    <span className="text-[10px] tabular-nums opacity-70">{theme.number}</span>
                  </div>
                  <div aria-hidden="true" className="relative mx-auto my-4 flex h-40 w-40 items-center justify-center">
                    <span className="absolute inset-0 rounded-full border border-current opacity-15" />
                    <span className={cn("absolute inset-3 rounded-full", theme.circle)} />
                    <span className="absolute inset-6 rounded-full border border-current opacity-15" />
                    <Icon size={76} strokeWidth={1.1} className="relative -rotate-12" />
                    <Sprout size={34} strokeWidth={1} className="absolute -left-2 bottom-7 -rotate-45" />
                    <Leaf size={28} strokeWidth={1} className="absolute -right-1 top-5 rotate-45" />
                  </div>
                  <p className="relative z-10 mt-auto text-center text-[8px] font-semibold tracking-[0.16em]">{theme.motif}</p>
                </div>

                <div className="flex flex-1 flex-col p-5 lg:p-6">
                  <p className={cn("text-[9px] font-semibold uppercase tracking-[0.15em]", theme.ink)}>{category.name}</p>
                  <h3 className="mt-2 font-serif text-2xl leading-tight tracking-[-0.02em] text-[#302016]">{category.title}</h3>
                  <p className="mb-5 mt-3 text-xs leading-6 text-[#76604c]">{category.description}</p>
                  <div className="mt-auto">
                    <div className="mb-5 flex items-center gap-2 border-y border-[#e9dfd0] py-3 text-[10px] text-[#785b40]"><Sprout size={14} aria-hidden="true" /><span>{category.spotlight}</span><span className="ml-auto shrink-0 text-[8px] uppercase tracking-wider text-[#8b7762]">Category basics</span></div>
                    <details className="group">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold text-[#4d3826] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b6545] [&::-webkit-details-marker]:hidden">
                        <span className="inline-flex items-center gap-2"><BookOpen size={15} strokeWidth={1.5} aria-hidden="true" /> A closer look</span>
                        <ChevronDown size={15} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" />
                      </summary>
                      <dl className="space-y-4 pb-4 pt-3">
                        {category.facts.map((fact) => <div key={fact.title}><dt className="text-xs font-semibold text-[#4d3826]">{fact.title}</dt><dd className="mt-1 text-xs leading-6 text-[#76604c]">{fact.text}</dd></div>)}
                      </dl>
                    </details>
                    <Link href={collectionHref(category.slug)} className="mt-3 inline-flex min-h-11 items-center gap-2 text-[10px] font-medium text-[#8b6545] underline decoration-[#c6b298] underline-offset-4 hover:text-[#302016] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b6545]">Explore {category.name}<ArrowUpRight size={13} aria-hidden="true" /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 rounded-xl border border-[#e2d8c8] bg-[#f1ebdf] p-5 sm:p-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#8b6545]">Know your cup</p>
            <h3 className="mt-2 font-serif text-2xl tracking-[-0.02em] text-[#302016]">Small details. Better choices.</h3>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3"><ScanLine size={21} strokeWidth={1.4} aria-hidden="true" className="mt-0.5 shrink-0 text-[#8b6545]" /><div><p className="text-xs font-semibold text-[#4d3826]">Read the ingredients</p><p className="mt-1 text-xs leading-6 text-[#76604c]">Check the base, added ingredients and allergen information.</p></div></div>
            <div className="flex items-start gap-3"><ListChecks size={21} strokeWidth={1.4} aria-hidden="true" className="mt-0.5 shrink-0 text-[#8b6545]" /><div><p className="text-xs font-semibold text-[#4d3826]">Compare the serving</p><p className="mt-1 text-xs leading-6 text-[#76604c]">Serving size and preparation make a difference when comparing labels.</p></div></div>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-[11px] leading-6 text-[#8b7762]">A first look at the categories. HOYYA product ingredients, nutrition and preparation details will be shared at launch.</p>
      </div>
    </section>
  );
}
