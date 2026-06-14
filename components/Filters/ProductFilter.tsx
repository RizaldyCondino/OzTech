"use client";
import { useFilterState } from "./useFilterState";
import FilterContent from "./FilterContent";
import { useSharedFilterState } from "./FilterProvider";

interface Props {
  filterState?: ReturnType<typeof useFilterState>;
  brands?: string[];
}

export default function ProductFilter({ filterState: external, brands = [] }: Props) {
  const shared = useSharedFilterState();
  const fallback = useFilterState(brands);
  const internal = external ?? shared ?? fallback;
  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm">
      <h2 className="font-semibold text-xl mb-6">Filters</h2>
      <FilterContent {...internal} />
    </div>
  );
}
