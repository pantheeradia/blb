// Category education only. Add product-specific ingredients, benefits and
// nutrition claims here once approved HOYYA label information is available.
export const HOYYA_EDUCATION = [
  {
    slug: "hoyya-tea",
    name: "HOYYA Tea",
    theme: "tea" as const,
    title: "Find your cup of comfort.",
    description: "Get to know the leaves, blends and flavours behind your tea ritual.",
    spotlight: "Tea leaves & blends",
    facts: [
      { title: "Start with the base", text: "The tea base, spices and flavourings help shape a blend's taste. Check the ingredient list to see what is in your cup." },
      { title: "Every blend is different", text: "Tea blends and premixes can have different ingredients and preparation methods. Follow the instructions for your chosen product." },
      { title: "Make an informed choice", text: "Look at serving size, added sugar and allergens when comparing blends." },
    ],
  },
  {
    slug: "hoyya-protein",
    name: "HOYYA Protein",
    theme: "protein" as const,
    title: "A little protein know-how.",
    description: "Understand the source, serving size and label before choosing your mix.",
    spotlight: "Protein source & serving",
    facts: [
      { title: "Know the source", text: "Protein products can use dairy or plant sources. The ingredient list tells you which sources a particular blend contains." },
      { title: "Compare like for like", text: "Serving sizes vary. Compare protein per serving alongside the suggested serving size, rather than judging by pack size." },
      { title: "Check what suits you", text: "Read allergen information and dietary labels. A product's name alone does not tell you whether it is dairy-free or plant-based." },
    ],
  },
  {
    slug: "hoyya-matcha",
    name: "HOYYA Matcha",
    theme: "matcha" as const,
    title: "Meet your green ritual.",
    description: "Discover what makes matcha different from a leaf-brewed cup of tea.",
    spotlight: "Finely ground green tea",
    facts: [
      { title: "A different kind of tea", text: "Matcha is finely ground green tea. The powder is mixed into your drink, rather than steeped and removed like tea leaves." },
      { title: "Powder or blended mix?", text: "Matcha powder and matcha drink mixes are different formats. Check the ingredient list for added ingredients such as milk or sweeteners." },
      { title: "Get to know the flavour", text: "Matcha can have grassy and savoury notes. The final taste depends on the blend and how it is prepared." },
    ],
  },
];
