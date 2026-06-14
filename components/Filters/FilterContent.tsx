"use client";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  COLORS,
  LOCATIONS,
  MAX_PRICE,
  MIN_PRICE,
  type FilterState,
} from "./useFilterState";

interface Props {
  filters: FilterState;
  brands: string[];
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  toggleColor: (v: string) => void;
  selectAllColors: () => void;
  reset: () => void;
  onApply?: () => void;
}

export default function FilterContent({
  filters,
  brands,
  setFilters,
  toggleColor,
  selectAllColors,
  reset,
  onApply,
}: Props) {
  const [showAllColors, setShowAllColors] = useState(false);
  const visibleColors = showAllColors ? COLORS : COLORS.slice(0, 4);
  const allColorsSelected = filters.colors.length === COLORS.length;

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Price range</p>
        <div className="relative h-2 rounded-full bg-gray-200">
          <div
            className="absolute h-2 rounded-full bg-orange-400"
            style={{
              left: `${((filters.priceMin - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
              right: `${100 - ((filters.priceMax - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={500}
            value={filters.priceMin}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v < filters.priceMax)
                setFilters((p) => ({ ...p, priceMin: v }));
            }}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={500}
            value={filters.priceMax}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v > filters.priceMin)
                setFilters((p) => ({ ...p, priceMax: v }));
            }}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow pointer-events-none"
            style={{
              left: `calc(${((filters.priceMin - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}% - 8px)`,
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow pointer-events-none"
            style={{
              left: `calc(${((filters.priceMax - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}% - 8px)`,
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>$ {filters.priceMin.toLocaleString()}</span>
          <span>$ {filters.priceMax.toLocaleString()}</span>
        </div>
      </div>

      {/* Brand — dynamic from Sanity */}
      <div className="relative">
        <select
          value={filters.brand}
          onChange={(e) => setFilters((p) => ({ ...p, brand: e.target.value }))}
          className="w-full appearance-none border rounded-xl px-4 py-3 text-sm text-gray-600
                     bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
        >
          <option value="">Choose Brand</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Location */}
      <div className="relative">
        <select
          value={filters.location}
          onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
          className="w-full appearance-none border rounded-xl px-4 py-3 text-sm text-gray-600
                     bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
        >
          <option value="">Choose Location</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Color</p>
          <button
            onClick={selectAllColors}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
          >
            <CheckCircle2 size={14} className={allColorsSelected ? "text-orange-500" : "text-gray-300"} />
            Select All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {visibleColors.map((color) => {
            const isActive = filters.colors.includes(color.value);
            return (
              <button
                key={color.value}
                onClick={() => toggleColor(color.value)}
                className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all
                            ${isActive
                              ? "bg-orange-50 border-orange-200 text-orange-600"
                              : "border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50"}`}
              >
                {color.label}
              </button>
            );
          })}
        </div>
        {COLORS.length > 4 && (
          <button
            onClick={() => setShowAllColors((p) => !p)}
            className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            {showAllColors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showAllColors ? "Show less" : "+ Show more"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onApply}
          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white
                     font-semibold text-sm transition-colors"
        >
          FILTER
        </button>
        <button
          onClick={reset}
          className="w-full py-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
}