import { useState } from "react";

export const COLORS = [
  { label: "White", value: "white" },
  { label: "Black", value: "black" },
  { label: "Blue",  value: "blue"  },
  { label: "Red",   value: "red"   },
  { label: "Green", value: "green" },
  { label: "Gold",  value: "gold"  },
];

export const BRANDS    = ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo"];
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

export function useFilterState() {
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

  return { filters, setFilters, toggleColor, selectAllColors, reset, activeCount };
}