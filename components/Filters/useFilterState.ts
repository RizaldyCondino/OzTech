import { useState } from "react";

export const COLORS = [
  { label: "White", value: "white" },
  { label: "Black", value: "black" },
  { label: "Blue",  value: "blue"  },
  { label: "Red",   value: "red"   },
  { label: "Green", value: "green" },
  { label: "Gold",  value: "gold"  },
];

export const LOCATIONS = ["Manila", "Cebu", "Davao", "Quezon City"];
export const MIN_PRICE = 0;
export const MAX_PRICE = 90_500;

export interface FilterState {
  priceMin: number;
  priceMax: number;
  brand: string;
  location: string;
  colors: string[];
}

export interface FilterableProduct {
  price?: number | null;
  brand?: { name?: string | null } | null;
  variants?: {
    values?: {
      label?: string | null;
    }[];
  }[];
}

export function useFilterState(brands: string[] = []) {
  const [filters, setFilters] = useState<FilterState>({
    priceMin: MIN_PRICE,
    priceMax: MAX_PRICE,
    brand: "",
    location: "",
    colors: [],
  });

  const toggleColor = (value: string) =>
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(value)
        ? prev.colors.filter((c) => c !== value)
        : [...prev.colors, value],
    }));

  const selectAllColors = () =>
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.length === COLORS.length ? [] : COLORS.map((c) => c.value),
    }));

  const reset = () =>
    setFilters({ priceMin: MIN_PRICE, priceMax: MAX_PRICE, brand: "", location: "", colors: [] });

  const activeCount =
    (filters.brand ? 1 : 0) +
    (filters.location ? 1 : 0) +
    filters.colors.length +
    (filters.priceMin !== MIN_PRICE || filters.priceMax !== MAX_PRICE ? 1 : 0);

  function filterProducts<T extends FilterableProduct>(products: T[]) {
    return products.filter((p) => {
      const price = p.price ?? 0;
      if (price < filters.priceMin || price > filters.priceMax) return false;
      if (filters.brand && p.brand?.name !== filters.brand) return false;
      if (
        filters.colors.length > 0 &&
        !filters.colors.some((c) =>
          p.variants?.some((v) =>
            v.values?.some((val) =>
              val.label?.toLowerCase().includes(c.toLowerCase())
            )
          )
        )
      ) return false;
      return true;
    });
  }

  return { filters, setFilters, toggleColor, selectAllColors, reset, activeCount, filterProducts, brands };
}
