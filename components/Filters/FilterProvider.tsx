"use client";

import {
  createContext,
  type ReactNode,
  useContext,
} from "react";
import { useFilterState } from "./useFilterState";

type FilterContextValue = ReturnType<typeof useFilterState>;

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({
  brands,
  children,
}: {
  brands?: string[];
  children: ReactNode;
}) {
  const filterState = useFilterState(brands);

  return (
    <FilterContext.Provider value={filterState}>
      {children}
    </FilterContext.Provider>
  );
}

export function useSharedFilterState() {
  return useContext(FilterContext);
}
