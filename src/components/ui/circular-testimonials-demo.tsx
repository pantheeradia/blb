import { CircularTestimonials } from "@/components/ui/circular-testimonials";

const testimonials = [
  { name: "Your morning ritual", designation: "Coffee collection demo", quote: "Discover coffee for your everyday cup.", src: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80" },
  { name: "Slow mornings", designation: "Coffee collection demo", quote: "Take a moment to brew something you love.", src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80" },
  { name: "A fresh start", designation: "Coffee collection demo", quote: "Find your next favourite brew.", src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80" },
];

// Standalone preview data; the homepage supplies real catalog products instead.
export function CircularTestimonialsDemo() {
  return <div className="overflow-hidden bg-[#f5efe6] px-6 py-16"><CircularTestimonials testimonials={testimonials} autoplay={false} label="Coffee collection" /></div>;
}
