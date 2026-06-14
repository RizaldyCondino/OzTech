"use client";
import { useFilterState } from "./useFilterState";
import FilterContent from "./FilterContent";

export default function ProductFilter() {
  const filterState = useFilterState();
  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm">
      <h2 className="font-semibold text-xl mb-6">Filters</h2>
      <FilterContent {...filterState} />
    </div>
  );
}