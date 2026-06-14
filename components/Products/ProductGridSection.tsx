"use client";
import { useMemo } from "react";
import { useFilterState } from "@/components/Filters/useFilterState";
import FilterContent from "@/components/Filters/FilterContent";
import FilterDrawer from "@/components/Filters/FilterDrawer";
import ProductGridSection from "@/components/Products/ProductGridSection";

interface Props {
  products: any[];
  displayStyle?: "grid" | "wide";
}

export default function FilterableProductGrid({ products, displayStyle = "grid" }: Props) {
  // Extract unique brand names from the products themselves
const brands = useMemo(() => {
  const extracted = products.map((p) => p.brand?.name).filter(Boolean);
  console.log("brands extracted:", extracted); // check terminal/browser console
  return [...new Set(extracted)] as string[];
}, [products]);

  const filterState = useFilterState(brands);
  const filtered = filterState.filterProducts(products);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:w-72 flex-shrink-0 sticky top-8 self-start">
        <div className="border rounded-2xl p-6 bg-white shadow-sm">
          <h2 className="font-semibold text-xl mb-6">Filters</h2>
          <FilterContent {...filterState} brands={brands} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <FilterDrawer filterState={filterState} />

        <p className="text-sm text-gray-400 mb-3">
          {filtered.length} of {products.length} products
        </p>

        {filtered.length === 0 ? (
          <div className="py-20 text-center border rounded-2xl text-gray-400">
            No products match your filters.
          </div>
        ) : (
          <ProductGridSection products={filtered} displayStyle={displayStyle} />
        )}
      </div>
    </div>
  );
}