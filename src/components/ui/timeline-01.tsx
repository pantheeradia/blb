import Timeline, { type TimelineItem } from "@/components/ui/timeline-01-utils/timeline";
import { Badge } from "@/components/ui/badge";

const timelineData: TimelineItem[] = [
  {
    title: "A small roastery. A clear purpose.",
    description: "Bean Leaf Brew started as a passion project in a small roastery in Whitefield, Bengaluru. We wanted to bring the quality of specialty coffee you would find in the best cafes directly to your doorstep, without the cafe markup.",
    date: "The beginning",
    image: "/images/hero-image.jpeg",
    imageAlt: "A barista at the Bean Leaf Brew roastery",
  },
  {
    title: "Good coffee starts at the source.",
    description: "We source directly from award-winning estates in Coorg and Chikmagalur, Karnataka, where coffee grows at elevations of 3,100 to 4,000 ft. No middlemen. Just a direct connection to the places behind every blend.",
    date: "Rooted in Karnataka",
    image: "/images/DB_Beans_01.webp",
    imageAlt: "Bean Leaf Brew coffee beans",
  },
  {
    title: "Roasted with care. Brewed your way.",
    description: "Every batch is freshly profile-roasted in-house using state-of-the-art technology, then packed immediately to lock in the aroma and freshness. No stale stock. Just coffee that is honest and alive. Anytime. Anywhere.",
    date: "From our roastery to your cup",
    image: "/images/HB_03.webp",
    imageAlt: "Bean Leaf Brew House Brew coffee",
  },
];

export default function TimelineBlock01() {
  return (
    <section aria-labelledby="story-timeline-heading" className="overflow-hidden bg-[#f7f0e6] text-[#302016]">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="border-x border-b border-[#d4c4b0] px-6 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">
          <div className="max-w-2xl space-y-5">
            <Badge variant="outline" className="rounded-full px-3 py-1 font-normal uppercase tracking-[0.15em]">Our journey</Badge>
            <h2 id="story-timeline-heading" className="font-serif text-3xl leading-tight tracking-[-0.03em] md:text-4xl lg:text-5xl">Born in Whitefield.<br />Brewed with purpose.</h2>
            <p className="max-w-xl text-sm leading-7 text-[#705b4c] md:text-base">From a passion for specialty coffee to your everyday ritual. This is the story behind Bean Leaf Brew.</p>
          </div>
        </div>
        <div className="border-x border-[#d4c4b0]"><Timeline items={timelineData} respectReducedMotion={false} /></div>
        <div aria-hidden="true" className="h-10 border-x border-t border-[#d4c4b0] md:h-16" />
      </div>
    </section>
  );
}
