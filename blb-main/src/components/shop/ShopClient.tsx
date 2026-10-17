"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { type Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ChevronDown, Search, ShoppingBag, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { formatPriceDisplay, requiresOptionSelection } from "@/lib/productOptions";

interface Props {
  products: Product[];
}

// Premix subcategories that should be grouped under "Instant Premix"
const PREMIX_SUBCATEGORIES = ["instant-premix", "non-milk-tea", "milk-tea", "matcha-tea", "malt-protein"];

// Premix category configurations with variant mappings
const PREMIX_CATEGORIES = [
  {
    id: "non-milk-tea",
    label: "Non Milk Tea",
    variants: [
      { label: "GT Masala", slug: "green-tea-masala" },
      { label: "GT Cardamom", slug: "green-tea-cardamom" },
      { label: "GT Lemon", slug: "green-tea-lemon" },
      { label: "BT Peach-Lemon", slug: "black-tea-peach-lemon" },
      { label: "BT Masala", slug: "black-tea-masala" },
      { label: "BT Blueberry", slug: "black-tea-blueberry" },
      { label: "BT Lemon", slug: "black-tea-lemon" },
    ],
  },
  {
    id: "milk-tea",
    label: "Milk Tea",
    variants: [
      { label: "MTMASALA", slug: "milk-tea-masala" },
      { label: "MTCARD", slug: "milk-tea-cardamom" },
      { label: "MTGINGER", slug: "milk-tea-ginger" },
    ],
  },
  {
    id: "matcha-tea",
    label: "Matcha Tea",
    variants: [
      { label: "MATCHA LATTE", slug: "matcha-latte" },
    ],
  },
  {
    id: "malt-protein",
    label: "Malt Protein",
    variants: [
      { label: "Malt CVH", slug: "malt-protein-choco-hazelnut" },
      { label: "Malt KBC", slug: "malt-protein-kesar-badam" },
    ],
  },
];

export function ShopClient({ products }: Props) {
  const searchParams = useSearchParams();

  // Build the filter list from the categories actually present in the catalog,
  // preserving first-seen order. Group premix subcategories under "Instant Premix".
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    const hasPremixProducts = new Set<string>();
    
    for (const p of products) {
      if (!seen.has(p.category)) {
        seen.set(p.category, p.categoryLabel ?? p.category);
      }
      if (PREMIX_SUBCATEGORIES.includes(p.category)) {
        hasPremixProducts.add(p.category);
      }
    }
    
    // If there are any premix products, add "Instant Premix" as a parent category
    const categoryList = Array.from(seen, ([value, label]) => ({ label, value }));
    
    // Remove premix subcategories from the main list if Instant Premix will be shown
    const filteredList = hasPremixProducts.size > 0
      ? categoryList.filter(c => !PREMIX_SUBCATEGORIES.includes(c.value))
      : categoryList;
    
    // Insert "Instant Premix" after "whole-bean" if premix products exist
    if (hasPremixProducts.size > 0) {
      const wholeBeanIndex = filteredList.findIndex(c => c.value === "whole-bean");
      const insertIndex = wholeBeanIndex >= 0 ? wholeBeanIndex + 1 : filteredList.length;
      filteredList.splice(insertIndex, 0, { label: "Instant Premix", value: "instant-premix" });
    }
    
    return [
      { label: "All", value: "all" },
      ...filteredList,
    ];
  }, [products]);

  // Honour an initial ?category= from the URL, then let clicks override it.
  const urlCategory = searchParams.get("category");
  const initialActive =
    urlCategory && categories.some((c) => c.value === urlCategory) ? urlCategory : "all";
  const [active, setActive] = useState<string>(initialActive);

  // Premix-specific state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track selected variant for each category
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string | null>>({
    "non-milk-tea": "green-tea-masala",
    "milk-tea": "milk-tea-masala",
    "matcha-tea": "matcha-latte",
    "malt-protein": "malt-protein-choco-hazelnut",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products based on active category
  const filtered = useMemo(() => {
    if (active === "all") return products;

    // If Instant Premix is selected, show all premix subcategory products
    if (active === "instant-premix") {
      return products.filter((p) =>
        PREMIX_SUBCATEGORIES.includes(p.category) || p.category === "instant-premix"
      );
    }

    return products.filter((p) => p.category === active);
  }, [active, products]);

  // Filter categories to only include those with visible variants
  const visibleCategories = useMemo(() => {
    if (active !== "instant-premix") return PREMIX_CATEGORIES;
    
    return PREMIX_CATEGORIES.filter(category => {
      const categoryProductSlugs = category.variants.map(v => v.slug);
      const hasVisibleProducts = products.some(p => 
        categoryProductSlugs.includes(p.slug)
      );
      return hasVisibleProducts;
    });
  }, [active, products]);

  // Check if any visible premix products exist
  const hasVisiblePremixProducts = useMemo(() => {
    if (active !== "instant-premix") return true;
    return products.some(
      (p) => PREMIX_SUBCATEGORIES.includes(p.category) || p.category === "instant-premix"
    );
  }, [active, products]);

  // Get the selected product for each premix category
  const selectedProducts = useMemo(() => {
    if (active !== "instant-premix") return {};

    const result: Record<string, Product | null> = {};
    for (const category of PREMIX_CATEGORIES) {
      const slug = selectedVariants[category.id];
      // Find product by slug regardless of category
      result[category.id] = products.find((p) => p.slug === slug) || null;
    }
    return result;
  }, [active, selectedVariants, products]);

  // Handle variant selection
  const handleVariantSelect = (categoryId: string, variantSlug: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [categoryId]: variantSlug
    }));
    setOpenDropdown(null);
    setSearchQuery("");
  };

  const isInstantPremix = active === "instant-premix";

  // Custom inline product card for Instant Premixes with smaller image
  const PremixProductCard = ({
    product,
    categoryLabel,
    categoryId,
    visibleVariants,
    currentVariantLabel,
    openDropdown,
    setOpenDropdown,
    searchQuery,
    setSearchQuery,
    handleVariantSelect,
    selectedVariants,
  }: {
    product: Product;
    categoryLabel: string;
    categoryId: string;
    visibleVariants: Array<{ label: string; slug: string }>;
    currentVariantLabel: string;
    openDropdown: string | null;
    setOpenDropdown: (id: string | null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleVariantSelect: (categoryId: string, variantSlug: string) => void;
    selectedVariants: Record<string, string | null>;
  }) => {
    const { addItem } = useCartStore();
    const [imageError, setImageError] = useState(false);

    const weightOptions = product.weightOptions ?? [];
    const equipmentOptions = product.brewingEquipmentOptions ?? [];
    const needsSelection = requiresOptionSelection(product.category, weightOptions, equipmentOptions);

    const imageSrc =
      Array.isArray(product.images) &&
      product.images.length > 0 &&
      typeof product.images[0] === "string" &&
      product.images[0].trim() !== "" &&
      !imageError
        ? product.images[0].trim()
        : null;

    return (
      <div className="group flex flex-col w-full max-w-[400px] bg-[#FAFAF8] border border-[#D4C4B0] overflow-visible hover:shadow-md transition-shadow">
        <div className="p-4 pb-2 border-b border-[#D4C4B0]">
          <h3 className="font-serif text-lg text-[#1A0E08]">{categoryLabel}</h3>
        </div>
        <Link href={`/shop/${product.slug}`} className="flex flex-col flex-1">
          <div className="relative h-40 bg-[#EAD9C8] overflow-hidden flex-shrink-0">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.name || "Product"}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#EAD9C8]"
                role="img"
                aria-label={`${product.name || "Product"} image unavailable`}
              >
                <Package size={24} className="text-[#8B5E3C] mb-2" />
                <span className="text-xs text-[#8B5E3C] text-center px-4">
                  {product.name || "Product Image"}
                </span>
              </div>
            )}
            {product.regularPrice && (
              <span className="absolute top-2 left-2 bg-[#C9953C] text-[#1A0E08] text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5">
                Sale
              </span>
            )}
          </div>
          <div className="p-4 flex-1">
            <p className="text-[8px] uppercase tracking-widest text-[#8B5E3C] mb-1">
              {product.categoryLabel ?? product.category}
              {product.weight ? ` · ${product.weight}` : ""}
            </p>
            <h3 className="font-serif text-sm text-[#1A0E08] mb-1">{product.name}</h3>
            <p className="text-xs text-[#8B5E3C] leading-relaxed line-clamp-2">
              {product.shortDescription}
            </p>
          </div>
        </Link>
        <div className="px-4 pb-4 mt-auto flex items-center justify-between gap-3 max-[480px]:flex-wrap">
          <div className="flex items-baseline gap-1.5 flex-shrink-0 whitespace-nowrap">
            <span className="font-medium text-sm text-[#1A0E08]">{formatPriceDisplay(product.price, weightOptions)}</span>
            {product.regularPrice && weightOptions.length === 0 && (
              <span className="text-xs text-[#8B5E3C] line-through">{formatPrice(product.regularPrice)}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {visibleVariants.length > 0 && (
              <div className="relative w-[150px] min-w-[140px] max-w-[160px] flex-shrink-0">
                <button
                  onClick={() => {
                    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
                    setSearchQuery("");
                  }}
                  className="flex items-center justify-between px-2 py-1 h-10 bg-[#FAFAF8] border border-[#D4C4B0] rounded text-left text-xs text-[#1A0E08] hover:border-[#8B5E3C] transition-colors whitespace-nowrap w-full overflow-hidden"
                >
                  <span className="truncate">{currentVariantLabel}</span>
                  <ChevronDown size={12} className={`flex-shrink-0 transition-transform ${openDropdown === categoryId ? "rotate-180" : ""}`} />
                </button>

                {openDropdown === categoryId && (
                  <div className="absolute z-50 right-0 mt-1 bg-[#FAFAF8] border border-[#D4C4B0] shadow-lg min-w-[140px] sm:min-w-[160px]">
                    <div className="p-2 border-b border-[#D4C4B0]">
                      <div className="flex items-center gap-2 px-2 py-1 bg-[#F7F0E6] border border-[#D4C4B0]">
                        <Search size={12} className="text-[#8B5E3C]" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-transparent text-xs text-[#1A0E08] placeholder-[#8B5E3C] outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {visibleVariants
                        .filter(v => v.label.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((variant) => (
                          <button
                            key={variant.slug}
                            onClick={() => handleVariantSelect(categoryId, variant.slug)}
                            className={`w-full text-left px-3 py-1 text-xs transition-colors ${
                              selectedVariants[categoryId] === variant.slug
                                ? "bg-[#1A0E08] text-[#F7F0E6]"
                                : "text-[#1A0E08] hover:bg-[#EAD9C8]"
                            }`}
                          >
                            {variant.label}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => addItem(product)}
              className="flex items-center gap-1.5 bg-[#1A0E08] text-[#F7F0E6] text-[10px] uppercase tracking-widest px-3 py-2 h-10 hover:bg-[#4A2512] transition-colors flex-shrink-0"
            >
              <ShoppingBag size={12} />
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-10">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setActive(cat.value);
            }}
            className={`text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors ${
              active === cat.value
                ? "bg-[#1A0E08] text-[#F7F0E6] border-[#1A0E08]"
                : "text-[#8B5E3C] border-[#D4C4B0] hover:border-[#8B5E3C]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isInstantPremix ? (
        <div className="space-y-12">
          {!hasVisiblePremixProducts ? (
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9953C] mb-2">
                Instant Premixes
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1A0E08] mb-4">Instant Premixes</h2>
              <div className="bg-[#FAFAF8] border border-[#D4C4B0] rounded-lg p-12 text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-[#C9953C]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-[#1A0E08] mb-2">Coming Soon</h3>
                <p className="text-[#8B5E3C] text-sm">
                  Our instant premixes are coming soon. Stay tuned for something delicious!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {visibleCategories.map((category) => {
                const selectedProduct = selectedProducts[category.id];
                // Filter variants to only show visible ones with valid images
                const visibleVariants = category.variants.filter(variant => {
                  const product = products.find(p => p.slug === variant.slug);
                  if (!product) return false;
                  // Check if product has valid images
                  const hasValidImage =
                    Array.isArray(product.images) &&
                    product.images.length > 0 &&
                    typeof product.images[0] === "string" &&
                    product.images[0].trim() !== "";
                  return hasValidImage;
                });

                const currentSelected = selectedVariants[category.id];
                const isCurrentVisible = currentSelected ? visibleVariants.some(v => v.slug === currentSelected) : false;

                // Auto-select first visible variant if current selection is not visible
                if (!isCurrentVisible && visibleVariants.length > 0) {
                  setSelectedVariants(prev => ({
                    ...prev,
                    [category.id]: visibleVariants[0].slug
                  }));
                }

                const currentVariantLabel = currentSelected
                  ? visibleVariants.find(v => v.slug === currentSelected)?.label || "Select Variant"
                  : "Select Variant";

                return (
                  <div key={category.id} className="flex flex-col">
                    {selectedProduct && (
                      <div className="flex-1 flex">
                        <PremixProductCard
                          product={selectedProduct}
                          categoryLabel={category.label}
                          categoryId={category.id}
                          visibleVariants={visibleVariants}
                          currentVariantLabel={currentVariantLabel}
                          openDropdown={openDropdown}
                          setOpenDropdown={setOpenDropdown}
                          searchQuery={searchQuery}
                          setSearchQuery={setSearchQuery}
                          handleVariantSelect={handleVariantSelect}
                          selectedVariants={selectedVariants}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filtered.map((product) => (
            <div key={product.id} className="flex">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
