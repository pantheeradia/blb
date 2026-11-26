"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryVisual } from "./CategoryVisual";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp, ChevronDown, ChevronLeft, ChevronRight, LoaderCircle, Search, X } from "lucide-react";
import { type Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductGroupCard } from "./ProductGroupCard";
import { groupProducts, type ProductGroup } from "@/lib/groupProducts";
import { CATEGORIES } from "@/lib/categories";
import { STOREFRONT_CATEGORIES } from "@/lib/storefrontCategories";
import { BREWING_EQUIPMENT_CATALOG } from "@/lib/productOptions";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;


type SortValue = "featured" | "price-asc" | "price-desc" | "name-asc";

interface Props {
  products: Product[];
}

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}

function ShopPagination({
  page,
  totalPages,
  totalItems,
  itemLabel,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const firstItem = (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, totalItems);
  const visiblePages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const start = Math.max(1, Math.min(page - 2, totalPages - 4));
      return start + index;
    }
  );

  return (
    <nav
      aria-label="Shop pagination"
      className="mt-16 flex flex-col gap-5 border-t border-[#cdbba7] pt-7 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#806854]" aria-live="polite">
        {firstItem}–{lastItem} of {totalItems} {itemLabel}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Go to previous page"
          className="mr-2 inline-flex h-10 items-center gap-1 border border-[#cdbba7] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4a2818] transition-all duration-300 hover:border-[#4a2818] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={14} />
          Prev
        </button>
        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-label={"Go to page " + pageNumber}
            aria-current={pageNumber === page ? "page" : undefined}
            className={cn(
              "h-10 min-w-10 border px-3 text-xs tabular-nums transition-all duration-300",
              pageNumber === page
                ? "border-[#20110c] bg-[#20110c] text-[#fffaf2]"
                : "border-transparent text-[#765f4f] hover:border-[#cdbba7] hover:text-[#20110c]"
            )}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Go to next page"
          className="ml-2 inline-flex h-10 items-center gap-1 border border-[#cdbba7] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4a2818] transition-all duration-300 hover:border-[#4a2818] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
}

function groupPrice(group: ProductGroup): number {
  return Math.min(...group.variants.map((variant) => variant.sellingPrice));
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debounced;
}

export function ShopClient({ products }: Props) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlQuery = searchParams.get("q") ?? "";
  return <ShopCatalog key={JSON.stringify([urlCategory, urlQuery])} products={products} urlCategory={urlCategory} urlQuery={urlQuery} />;
}

const normalizeFilter = (value: string) => value.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();

function ShopCatalog({ products, urlCategory, urlQuery }: Props & { urlCategory: string | null; urlQuery: string }) {
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = useMemo(() => [
    { label: "All products", value: "all" },
    ...STOREFRONT_CATEGORIES.map((category) => ({ label: category.name, value: category.slug })),
    ...CATEGORIES.filter((category) => !STOREFRONT_CATEGORIES.some((item) => item.slug === category.slug)).map((category) => ({ label: category.name, value: category.slug })),
  ], []);

  const initialActive =
    urlCategory && categories.some((category) => category.value === urlCategory)
      ? urlCategory
      : "all";

  const [active, setActive] = useState(initialActive);
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [query, setQuery] = useState(urlQuery);
  const [sort, setSort] = useState<SortValue>("featured");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebouncedValue(query, 200);
  const searchPending = query !== debouncedQuery;
  const isSearching = debouncedQuery.trim().length > 0;
  const effectiveCategory = isSearching ? "all" : active;

  const searchSuggestions = useMemo(
    () => Array.from(new Set(products.map((product) => product.name))).slice(0, 12),
    [products]
  );

  const categoryProducts = useMemo(() => {
    if (effectiveCategory === "all") return products;
    return products.filter((product) => product.category === effectiveCategory);
  }, [effectiveCategory, products]);

  const roastOptions = useMemo(() => {
    const labels = new Map(["Light", "Medium Light", "Medium", "Medium Dark", "Dark"].map((label) => [normalizeFilter(label), label]));
    for (const product of products) {
      if (product.roast?.trim()) labels.set(normalizeFilter(product.roast), labels.get(normalizeFilter(product.roast)) ?? product.roast.trim());
    }
    return [...labels.entries()].map(([value, label]) => ({ value, label }));
  }, [products]);
  const equipmentOptions = useMemo(() => Array.from(new Set([
    ...BREWING_EQUIPMENT_CATALOG,
    ...products.flatMap((product) => product.brewingEquipmentOptions ?? []),
  ])), [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLocaleLowerCase();
    return categoryProducts.filter((product) => {
      if (selectedRoasts.length && !selectedRoasts.includes(normalizeFilter(product.roast ?? ""))) return false;
      if (selectedEquipment.length && !selectedEquipment.some((equipment) => product.brewingEquipmentOptions?.includes(equipment))) return false;
      if (!normalizedQuery) return true;
      return [
        product.name,
        product.shortDescription,
        product.description,
        product.categoryLabel,
        product.category,
        product.weight,
        product.roast,
        product.blend,
        ...(product.options?.variants.flatMap((variant) => [variant.name, variant.weight]) ?? []),
        ...product.tags,
        ...(product.notes ?? []),
      ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
    });
  }, [categoryProducts, debouncedQuery, selectedRoasts, selectedEquipment]);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [filteredProducts, sort]);

  const instantPremixGroups = useMemo(() => {
    const groups = groupProducts(sortedProducts);
    if (sort === "price-asc") groups.sort((a, b) => groupPrice(a) - groupPrice(b));
    if (sort === "price-desc") groups.sort((a, b) => groupPrice(b) - groupPrice(a));
    if (sort === "name-asc") groups.sort((a, b) => a.groupTitle.localeCompare(b.groupTitle));
    return groups;
  }, [sort, sortedProducts]);

  const isCategoryEmpty = categoryProducts.length === 0;
  const upcomingCategory = STOREFRONT_CATEGORIES.find((category) => category.slug === effectiveCategory && category.comingSoon);
  const isSearchEmpty = sortedProducts.length === 0 && isSearching;
  const totalItems = effectiveCategory === "instant-premix" ? instantPremixGroups.length : sortedProducts.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const visibleProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const visibleGroups = instantPremixGroups.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const activeLabel =
    categories.find((category) => category.value === effectiveCategory)?.label ?? "All products";

  const chooseCategory = (value: string) => {
    setActive(value);
    setPage(1);
    router.replace(value === "all" ? "/shop#catalog" : `/shop?category=${encodeURIComponent(value)}#catalog`, { scroll: false });
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    window.requestAnimationFrame(() => {
      document.getElementById("catalog-grid")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const resetFilters = () => {
    chooseCategory("all");
    setQuery("");
    setSort("featured");
    setSelectedRoasts([]);
    setSelectedEquipment([]);
    setPage(1);
  };

  return (
    <section id="catalog" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div>
            <h1 className="font-serif text-3xl leading-tight tracking-[-0.025em] text-[#27150e] sm:text-4xl">
              Shop our collection
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#705b4c]">
              Find your favourite coffee, beans and instant blends.
            </p>
          </div>

          <div className="w-full md:max-w-[340px]">
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <div className="flex items-center rounded-lg border border-[#d2c0ac] bg-[#faf6ef] px-3 transition-colors focus-within:border-[#8f5e3b]">
              {searchPending ? <LoaderCircle size={17} aria-label="Searching" role="status" className="shrink-0 animate-spin text-[#876b55] motion-reduce:animate-none" /> : <Search size={17} aria-hidden="true" className="shrink-0 text-[#876b55]" />}
              <input
                id="shop-search"
                type="search"
                list="shop-search-suggestions"
                autoComplete="off"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search products..."
                className="min-w-0 w-full bg-transparent px-3 py-3 text-sm text-[#27150e] outline-none placeholder:text-[#887260]"
              />
              <datalist id="shop-search-suggestions">
                {searchSuggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                  className="shrink-0 p-2 text-[#826a57] transition-colors hover:text-[#27150e]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </header>

        <nav aria-label="Product collections" className="mt-7 border-b border-[#d2c0ac] pb-5 sm:mt-8">
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 py-3 sm:gap-6">
            {categories.map((category) => {
              const selected = effectiveCategory === category.value;
              const visual = STOREFRONT_CATEGORIES.find((item) => item.slug === category.value) ?? { slug: category.value, name: category.label, icon: "coffee" as const, comingSoon: false, image: category.value === "all" ? "/images/Roasted-Beans.avif" : undefined };
              const image = visual.comingSoon ? undefined : products.find((product) => product.category === category.value && product.images.some(Boolean))?.images.find(Boolean);
              return (
                <button key={category.value} type="button" onClick={() => chooseCategory(category.value)} aria-pressed={selected}
                  className={cn("group flex w-24 shrink-0 snap-start flex-col items-center gap-3 rounded-lg text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]", selected ? "text-[#4a2818]" : "text-[#705b4c]")}>
                  <span className={cn("relative h-20 w-20 overflow-hidden rounded-full border border-[#dfcfbb] bg-[#eee3d2] transition-shadow", selected ? "ring-2 ring-[#8f5e3b] ring-offset-4 ring-offset-[#f3ece3]" : "group-hover:ring-1 group-hover:ring-[#b99b7d]")}>
                    <CategoryVisual category={visual} image={image} sizes="80px" />
                  </span>
                  <span className={cn("min-h-10 text-xs leading-5", selected ? "font-semibold" : "font-medium")}>{category.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8">
          <button type="button" aria-expanded={mobileFiltersOpen} aria-controls="product-filters" onClick={() => setMobileFiltersOpen((open) => !open)} className="flex items-center justify-between border-y border-[#d2c0ac] py-4 text-xs font-semibold uppercase tracking-widest text-[#27150e] lg:hidden">Filters ({selectedRoasts.length + selectedEquipment.length})<ChevronDown size={16} /></button>
          <aside id="product-filters" aria-label="Product filters" className={cn("border-y border-[#d2c0ac] lg:block lg:border-y-0 lg:border-r lg:pr-6", !mobileFiltersOpen && "hidden")}>
            <div className="flex items-center justify-between gap-3 py-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#27150e]">Filters</h3>
              {(selectedRoasts.length > 0 || selectedEquipment.length > 0) && <button type="button" className="text-xs text-[#8f5e3b] underline underline-offset-4" onClick={() => { setSelectedRoasts([]); setSelectedEquipment([]); setPage(1); }}>Clear all</button>}
            </div>
            {[
              { title: "Roast level", options: roastOptions, selected: selectedRoasts, update: setSelectedRoasts },
              { title: "Brewing equipment", options: equipmentOptions.map((label) => ({ value: label, label })), selected: selectedEquipment, update: setSelectedEquipment },
            ].map((filter) => (
              <details key={filter.title} open className="group border-t border-[#d2c0ac] py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#27150e] [&::-webkit-details-marker]:hidden">{filter.title}<ChevronDown size={15} className="transition-transform group-open:rotate-180" /></summary>
                <div className="mt-5 grid gap-3.5">
                  {filter.options.map((option) => <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm text-[#4a2818]"><input type="checkbox" checked={filter.selected.includes(option.value)} onChange={() => { filter.update((current) => current.includes(option.value) ? current.filter((value) => value !== option.value) : [...current, option.value]); setPage(1); }} className="h-4 w-4 shrink-0 accent-[#4a2818]" />{option.label}</label>)}
                </div>
              </details>
            ))}
          </aside>
          <div className="min-w-0">
            <div className="mb-6 flex flex-col gap-3 border-b border-[#d2c0ac] pb-4 sm:min-h-14 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#705b4c]" aria-live="polite">
                <span className="font-semibold text-[#27150e]">{totalItems}</span>{" "}
                {totalItems === 1 ? "product" : "products"}
                {effectiveCategory !== "all" ? <span className="ml-2 border-l border-[#cdbba7] pl-2">{activeLabel}</span> : null}
                {isSearching ? <span> across all categories</span> : null}
                {query ? <span> for &ldquo;{query}&rdquo;</span> : null}
              </p>

              <label className="flex items-center gap-3 text-xs font-medium text-[#705b4c]">
                <span className="flex shrink-0 items-center gap-2"><ArrowDownUp size={15} aria-hidden="true" />Sort by</span>
                <span className="relative min-w-0 flex-1 sm:flex-none">
                  <select
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value as SortValue);
                      setPage(1);
                    }}
                    className="min-h-11 w-full cursor-pointer appearance-none rounded-lg border border-[#cdbba7] bg-[#fffaf2] py-2.5 pl-3 pr-10 text-xs font-semibold text-[#27150e] transition-colors hover:border-[#8f5e3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f5e3b] sm:w-48"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="name-asc">Name: A–Z</option>
                  </select>
                  <ChevronDown size={15} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#826a57]" />
                </span>
              </label>
            </div>

            <div id="catalog-grid" aria-busy={searchPending} className="scroll-mt-24">
              {effectiveCategory === "instant-premix" && isCategoryEmpty ? (
                <div className="relative min-h-[360px] overflow-hidden bg-[#20110c]">
                  <div className="absolute inset-0 bg-[url('/images/Roasted-Beans.avif')] bg-cover bg-center opacity-35" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#20110c] via-[#20110c]/85 to-transparent" />
                  <div className="relative z-10 max-w-xl px-8 py-20 text-[#fffaf2] sm:px-14">
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d7a35f]">Coming soon</p>
                    <h3 className="font-serif text-4xl tracking-[-0.03em]">A quicker cup is brewing.</h3>
                    <p className="mt-5 text-sm leading-7 text-[#fffaf2]/65">
                      Our instant premix collection is being prepared. Check back soon for chai, coffee and malt blends.
                    </p>
                  </div>
                </div>
              ) : isCategoryEmpty && upcomingCategory ? (
                <div className="rounded-xl border border-[#ddcbb5] bg-[#faf6ef] px-6 py-16 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b6a3c]">Coming soon</p>
                  <h3 className="mt-4 font-serif text-3xl text-[#302016]">{upcomingCategory.name} is on its way.</h3>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#76604c]">We&apos;re preparing the HOYYA collection. In the meantime, explore freshly roasted coffee from Bean Leaf Brew.</p>
                  <button type="button" onClick={resetFilters} className="mt-6 min-h-11 rounded-lg bg-[#38251a] px-6 text-xs font-medium text-[#fffaf2] transition-colors hover:bg-[#805536]">Explore available products</button>
                </div>
              ) : isSearchEmpty || isCategoryEmpty || totalItems === 0 ? (
                <div className="border-y border-[#cdbba7] py-20 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b6a3c]">Nothing on this shelf</p>
                  <h3 className="mt-4 font-serif text-3xl text-[#20110c]">
                    Try a different search or collection.
                  </h3>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-7 border-b border-[#4a2818] pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4a2818] transition-colors hover:text-[#9b6a3c]"
                  >
                    Show all products
                  </button>
                </div>
              ) : effectiveCategory === "instant-premix" ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleGroups.map((group) => (
                    <ProductGroupCard key={group.groupKey} group={group} priority={false} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} priority={false} />
                  ))}
                </div>
              )}
            </div>

            {!isCategoryEmpty && !isSearchEmpty && totalItems > 0 && (
              <ShopPagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemLabel={effectiveCategory === "instant-premix" ? "collections" : "products"}
                onPageChange={changePage}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
