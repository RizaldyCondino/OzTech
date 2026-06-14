"use client";
import { useEffect, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { useFilterState } from "./useFilterState";
import FilterContent from "./FilterContent";

export default function FilterDrawer() {
  const [open, setOpen] = useState(false);
  const filterState = useFilterState();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Trigger bar — only on mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-30">
        <span className="text-sm text-gray-500 font-medium">
          {filterState.activeCount > 0
            ? `${filterState.activeCount} filter${filterState.activeCount > 1 ? "s" : ""} applied`
            : "No filters applied"}
        </span>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200
                     text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-500
                     transition-colors relative"
        >
          <SlidersHorizontal size={15} />
          Filters
          {filterState.activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-orange-500
                             text-white text-[10px] flex items-center justify-center font-bold">
              {filterState.activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-3xl
                    shadow-2xl transition-transform duration-300 ease-out
                    ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">Filters</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[70vh] px-6 py-5">
          <FilterContent
            {...filterState}
            onApply={() => setOpen(false)}
          />
        </div>
      </div>
    </>
  );
}