"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { type Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { GROUND_COFFEE_CATEGORY } from "@/lib/productOptions";
import { INSTANT_PREMIX_CATEGORY } from "@/lib/instantPremixOptions";

interface Props {
  product: Product;
  initialVariant?: string;
}

export function ProductActions({ product, initialVariant }: Props) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();
  const searchParams = useSearchParams();

  const isGroundCoffee = product.category === GROUND_COFFEE_CATEGORY;
  const isInstantPremix = product.category === INSTANT_PREMIX_CATEGORY;
  const weightOptions = isGroundCoffee ? product.weightOptions ?? [] : [];
  const equipmentOptions = isGroundCoffee ? product.brewingEquipmentOptions ?? [] : [];
  const instantPremixVariants = isInstantPremix ? product.options?.variants ?? [] : [];
  const hasWeight = weightOptions.length > 0;
  const hasEquipment = equipmentOptions.length > 0;
  const hasVariants = instantPremixVariants.length > 0;

  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(initialVariant ?? "");

  // Auto-select variant from URL param for instant premix
  useEffect(() => {
    if (isInstantPremix && hasVariants && !selectedVariant) {
      const variantParam = searchParams.get("variant");
      if (variantParam && instantPremixVariants.some((v) => v.name === variantParam)) {
        setSelectedVariant(variantParam);
      }
    }
  }, [isInstantPremix, hasVariants, instantPremixVariants, searchParams, selectedVariant]);

  const selectedWeightOption = weightOptions.find((w) => w.label === selectedWeight);
  const selectedVariantOption = instantPremixVariants.find((v) => v.name === selectedVariant);

  // Required-selection gating: when options exist, they must be chosen.
  const needsWeight = hasWeight && !selectedWeight;
  const needsEquipment = hasEquipment && !selectedEquipment;
  const needsVariant = hasVariants && !selectedVariant;
  const canAdd = !needsWeight && !needsEquipment && !needsVariant;

  function handleAdd() {
    if (!canAdd) return;
    addItem(product, qty, {
      selectedWeight: hasWeight ? selectedWeight : undefined,
      selectedWeightPrice: selectedWeightOption?.price,
      selectedEquipment: hasEquipment ? selectedEquipment : undefined,
      selectedVariant: hasVariants ? selectedVariant : undefined,
      selectedVariantPrice: selectedVariantOption?.sellingPrice,
    });
  }

  const selectCls =
    "w-full border border-[#D4C4B0] bg-[#FAFAF8] text-[#1A0E08] text-sm px-4 py-3 focus:outline-none focus:border-[#8B5E3C] transition-colors";

  return (
    <div className="space-y-5">
      {(hasWeight || hasEquipment || hasVariants) && (
        <div className="space-y-4">
          {hasWeight && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8B5E3C] mb-1.5">
                Weight
              </label>
              <select
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
                className={selectCls}
              >
                <option value="">Choose an option</option>
                {weightOptions.map((w) => (
                  <option key={w.label} value={w.label}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hasEquipment && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8B5E3C] mb-1.5">
                Brewing Equipment
              </label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className={selectCls}
              >
                <option value="">Choose an option</option>
                {equipmentOptions.map((eq) => (
                  <option key={eq} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hasVariants && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8B5E3C] mb-1.5">
                Variant
              </label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className={selectCls}
              >
                <option value="">Choose an option</option>
                {instantPremixVariants.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} {v.weight ? `(${v.weight})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedWeightOption && (
            <p className="text-xl font-medium text-[#1A0E08]">
              {formatPrice(selectedWeightOption.price)}
            </p>
          )}

          {selectedVariantOption && (
            <p className="text-xl font-medium text-[#1A0E08]">
              {formatPrice(selectedVariantOption.sellingPrice)}
              {selectedVariantOption.regularPrice && (
                <span className="text-base text-[#8B5E3C] line-through ml-2">
                  {formatPrice(selectedVariantOption.regularPrice)}
                </span>
              )}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-[#D4C4B0]">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center text-[#8B5E3C] hover:text-[#1A0E08] transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-medium text-[#1A0E08]">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-11 flex items-center justify-center text-[#8B5E3C] hover:text-[#1A0E08] transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1A0E08] text-[#F7F0E6] text-xs font-semibold uppercase tracking-widest py-3 px-6 hover:bg-[#4A2512] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>

      {!canAdd && (
        <p className="text-xs text-[#8B5E3C]">
          Please select {needsWeight ? "a weight" : ""}
          {needsWeight && (needsEquipment || needsVariant) ? " and " : ""}
          {needsEquipment ? "brewing equipment" : ""}
          {needsEquipment && needsVariant ? " and " : ""}
          {needsVariant ? "a variant" : ""} to continue.
        </p>
      )}
    </div>
  );
}
