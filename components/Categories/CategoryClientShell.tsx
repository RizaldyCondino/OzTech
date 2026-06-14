"use client";
import { useFilterState } from "@/components/Filters/useFilterState";
import FilterContent from "@/components/Filters/FilterContent";
import FilterDrawer from "@/components/Filters/FilterDrawer";
import ProductCard from "@/components/ProductCard";
import ProductCardWide from "@/components/Products/ProductCardWide";
import Pagination from "@/components/Pagination";

interface Props {
  products: any[];
  brands: string[];
  displayStyle?: "grid" | "wide";
  /**
   * "all"          – drawer + products (non-"all" category pages)
   * "filter-only"  – renders only the desktop sidebar <ProductFilter> panel
   * "products-only"– renders drawer + product grid (the "all" slug main column)
   */
  mode?: "all" | "filter-only" | "products-only";
}

export default function CategoryClientShell({
  products,
  brands,
  displayStyle = "grid",
  mode = "all",
}: Props) {
  const filterState = useFilterState(brands);
  const filtered = filterState.filterProducts(products);

  // Sidebar desktop filter panel only
  if (mode === "filter-only") {
    return (
      <div className="border rounded-2xl p-6 bg-white shadow-sm">
        <h2 className="font-semibold text-xl mb-6">Filters</h2>
        <FilterContent {...filterState} />
      </div>
    );
  }

  // Products + mobile drawer
  return (
    <>
      <FilterDrawer filterState={filterState} />

      {filtered.length === 0 ? (
        <div className="mt-4 py-20 text-center border rounded-2xl text-gray-400">
          No products match your filters.
        </div>
      ) : displayStyle === "wide" ? (
        <div className="mt-4 flex flex-col gap-4">
          {filtered.map((p) => (
            <ProductCardWide key={p._id} {...p} />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p._id} {...p} />
          ))}
        </div>
      )}

      <Pagination totalItems={filtered.length} itemsPerPage={8} />
    </>
  );
}