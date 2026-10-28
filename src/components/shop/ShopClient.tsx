"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownUp, ChevronDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { type Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductGroupCard } from "./ProductGroupCard";
import { groupProducts, type ProductGroup } from "@/lib/groupProducts";
import { CATEGORIES } from "@/lib/categories";
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

export function ShopClient({ products }: Props) {
  const searchParams = useSearchParams();

  const categories = useMemo(() => {
    const excludedSlugs = [
      "non-milk-tea",
      "milk-tea",
      "matcha-tea",
      "malt-protein",
      "merchandise-accessories",
    ];
    const filteredCategories = CATEGORIES.filter((category) => !excludedSlugs.includes(category.slug));

    return [
      { label: "All products", value: "all" },
      ...filteredCategories.map((category) => ({ label: category.name, value: category.slug })),
    ];
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const product of products) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const urlCategory = searchParams.get("category");
  const initialActive =
    urlCategory && categories.some((category) => category.value === urlCategory)
      ? urlCategory
      : "all";

  const [active, setActive] = useState(initialActive);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("featured");
  const [page, setPage] = useState(1);

  const categoryProducts = useMemo(() => {
    if (active === "all") return products;
    return products.filter((product) => product.category === active);
  }, [active, products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return categoryProducts;

    return categoryProducts.filter((product) =>
      [
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
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
    );
  }, [categoryProducts, query]);

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
  const isSearchEmpty = sortedProducts.length === 0 && query.trim().length > 0;
  const totalItems = active === "instant-premix" ? instantPremixGroups.length : sortedProducts.length;
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
    categories.find((category) => category.value === active)?.label ?? "All products";

  const chooseCategory = (value: string) => {
    setActive(value);
    setPage(1);
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
    setActive("all");
    setQuery("");
    setSort("featured");
    setPage(1);
  };

  return (
    <section id="catalog" className="scroll-mt-16 bg-[#f7f0e6]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:py-20">
        <header className="grid gap-8 lg:grid-cols-[1fr_minmax(360px,0.72fr)] lg:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b6a3c]">
              The collection
            </p>
            <h2 className="max-w-2xl font-serif text-4xl leading-[0.98] tracking-[-0.035em] text-[#20110c] sm:text-5xl">
              Pick a coffee that fits your ritual.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#765f4f]">
              From slow filter mornings to quick premix breaks, every product is made and packed by our team in Whitefield.
            </p>
          </div>

          <div>
            <label htmlFor="shop-search" className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#806854]">
              Search the shelf
            </label>
            <div className="flex items-center border-b border-[#9f8870] bg-[#fffaf2]/55 px-1 transition-colors focus-within:border-[#20110c]">
              <Search size={17} aria-hidden="true" className="shrink-0 text-[#8f6d55]" />
              <input
                id="shop-search"
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Coffee, roast, tasting note..."
                className="w-full bg-transparent px-3 py-4 text-sm text-[#20110c] outline-none placeholder:text-[#8b735f]/65"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                  className="shrink-0 p-2 text-[#806854] transition-colors hover:text-[#20110c]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </header>

        <nav aria-label="Product collections" className="mt-12 border-y border-[#cdbba7]">
          <div className="scrollbar-hide flex gap-7 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => chooseCategory(category.value)}
                aria-pressed={active === category.value}
                className={cn(
                  "relative shrink-0 py-5 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors",
                  active === category.value
                    ? "text-[#20110c] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#20110c]"
                    : "text-[#8b735f] hover:text-[#20110c]"
                )}
              >
                {category.label}
                <sup className="ml-1.5 text-[8px] font-medium tabular-nums text-[#9b6a3c]">
                  {categoryCounts[category.value] ?? 0}
                </sup>
              </button>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#765f4f]" aria-live="polite">
            <span className="font-semibold text-[#20110c]">{totalItems}</span>{" "}
            {totalItems === 1 ? "result" : "results"} in {activeLabel.toLowerCase()}
            {query ? <span> for &ldquo;{query}&rdquo;</span> : null}
          </p>

          <label className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#806854]">
            <ArrowDownUp size={14} aria-hidden="true" />
            Sort
            <span className="relative">
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortValue);
                  setPage(1);
                }}
                className="appearance-none border-b border-[#9f8870] bg-transparent py-2 pl-1 pr-7 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#20110c] outline-none transition-colors focus:border-[#20110c]"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name-asc">Name: A–Z</option>
              </select>
              <ChevronDown size={13} aria-hidden="true" className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#806854]" />
            </span>
          </label>
        </div>

        <div id="catalog-grid" className="scroll-mt-24">
          {active === "instant-premix" && isCategoryEmpty ? (
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
          ) : active === "instant-premix" ? (
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {visibleGroups.map((group, index) => (
                <ProductGroupCard key={group.groupKey} group={group} priority={index < 3 && currentPage === 1} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 3 && currentPage === 1} />
              ))}
            </div>
          )}
        </div>

        {!isCategoryEmpty && !isSearchEmpty && totalItems > 0 && (
          <ShopPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemLabel={active === "instant-premix" ? "collections" : "products"}
            onPageChange={changePage}
          />
        )}
      </div>
    </section>
  );
}
