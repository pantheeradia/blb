export interface CoffeeVideo {
  id: string;
  src: string;
  poster: string;
  title: string;
  description: string;
  credit: string;
  topic: "Coffee" | "Coffee education" | "Brewing methods";
  source: "Bean Leaf Brew" | "Creator story";
}

// Add approved creator clips and brewing films here as footage becomes available.
// Only list real, available videos; HOYYA guides belong in a future separate collection.
export const COFFEE_VIDEOS: CoffeeVideo[] = [
  {
    id: "the-blb-brew",
    src: "/videos/file.mp4",
    poster: "/images/HB_03.webp",
    title: "The BLB brew",
    description: "A closer look at the coffee behind your daily cup.",
    credit: "Bean Leaf Brew",
    topic: "Coffee",
    source: "Bean Leaf Brew",
  },
];
