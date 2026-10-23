"use client";

import { PRODUCT_TYPES, type ProductType, type InstantPremixVariant } from "@/lib/instantPremixOptions";

interface InstantPremixConfigurationProps {
  productType: ProductType | null;
  variants: InstantPremixVariant[];
  onProductTypeChange: (type: ProductType | null) => void;
  onVariantChange: (index: number, field: keyof InstantPremixVariant, value: string | number | null) => void;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
}

export function InstantPremixConfiguration({
  productType,
  variants,
  onProductTypeChange,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
}: InstantPremixConfigurationProps) {
  const selectedType = PRODUCT_TYPES.find((t) => t.id === productType);

  function handleSelectType(typeId: ProductType) {
    onProductTypeChange(typeId);
    // Variants will be reset by parent when product type changes
  }

  const inputCls = "w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm px-3 py-2 rounded focus:outline-none focus:border-amber-500";
  const labelCls = "block text-gray-400 text-xs uppercase tracking-wider mb-1";

  return (
    <div className="border border-gray-800 rounded p-4 space-y-4 bg-gray-900/40">
      <p className="text-amber-400/90 text-xs uppercase tracking-wider font-semibold">
        Instant Premix Configuration
      </p>
      <p className="text-gray-500 text-xs">
        Choose a product type and configure its variants.
      </p>

      {/* Product Type Cards */}
      <div className="grid grid-cols-2 gap-3">
        {PRODUCT_TYPES.map((type) => {
          const isSelected = productType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => handleSelectType(type.id)}
              className={`p-4 rounded border text-left transition-colors ${
                isSelected
                  ? "bg-amber-600/20 border-amber-500"
                  : "bg-gray-800 border-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="text-white font-medium text-sm mb-1">{type.label}</div>
              <div className="text-gray-400 text-xs">{type.description}</div>
              <div className="mt-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    isSelected
                      ? "bg-amber-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {isSelected ? "Selected" : "Select"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Variant Editor */}
      {selectedType && variants.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-medium text-sm">
              {selectedType.label.toUpperCase()} / {selectedType.description.split("•")[0].trim().toUpperCase()}
            </p>
            <p className="text-gray-400 text-xs">
              Configure {variants.length} variant{variants.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="bg-gray-800/50 rounded p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-amber-400/90 text-xs font-medium">
                    Variant {index + 1}
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveVariant(index)}
                      className="text-red-400 hover:text-red-300 text-xs"
                      title="Remove variant"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Name *</label>
                    <input
                      className={inputCls}
                      value={variant.name}
                      onChange={(e) => onVariantChange(index, "name", e.target.value)}
                      placeholder="e.g. Classic"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Weight / Pack Size</label>
                    <input
                      className={inputCls}
                      value={variant.weight}
                      onChange={(e) => onVariantChange(index, "weight", e.target.value)}
                      placeholder="e.g. 250g"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Selling Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      <input
                        className={inputCls + " pl-7"}
                        type="number"
                        value={variant.sellingPrice || ""}
                        onChange={(e) => onVariantChange(index, "sellingPrice", Number(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Regular Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      <input
                        className={inputCls + " pl-7"}
                        type="number"
                        value={variant.regularPrice || ""}
                        onChange={(e) => onVariantChange(index, "regularPrice", Number(e.target.value) || null)}
                        placeholder="optional"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddVariant}
            className="mt-4 text-amber-400 hover:text-amber-300 text-xs border border-amber-600/50 rounded px-3 py-1.5"
          >
            + Add Variant
          </button>
        </div>
      )}
    </div>
  );
}
