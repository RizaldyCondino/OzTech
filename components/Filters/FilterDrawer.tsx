"use client";
import { useEffect, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import FilterContent from "./FilterContent";
import { useFilterState } from "./useFilterState";
import { useSharedFilterState } from "./FilterProvider";

interface Props {
  filterState?: ReturnType<typeof useFilterState>;
  placement?: "bottom" | "right";
}

export default function FilterDrawer({
  filterState: externalState,
  placement = "bottom",
}: Props) {
  const sharedState = useSharedFilterState();
  const internalState = useFilterState();
  const filterState = externalState ?? sharedState ?? internalState;
  const [open, setOpen] = useState(false);
  const isRightSide = placement === "right";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className={`flex items-center px-4 py-3 bg-white border-b sticky top-0 z-30 ${isRightSide ? "justify-end" : "justify-between"}`}>
        {!isRightSide && (
          <span className="text-sm text-gray-500 font-medium">
            {filterState.activeCount > 0
              ? `${filterState.activeCount} filter${filterState.activeCount > 1 ? "s" : ""} applied`
              : "No filters applied"}
          </span>
        )}
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

      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 " onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed z-50 bg-white shadow-2xl transition-transform duration-300 ease-out
                    ${isRightSide
                      ? `top-0 bottom-0 right-0 w-full max-w-sm rounded-l-3xl ${open ? "translate-x-0" : "translate-x-full"}`
                      : `bottom-0 left-0 right-0 rounded-t-3xl ${open ? "translate-y-0" : "translate-y-full"}`}`}
      >
        {!isRightSide && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>
        )}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">Filters</h2>
          <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className={`overflow-y-auto px-6 py-5 ${isRightSide ? "h-[calc(100vh-73px)]" : "max-h-[70vh]"}`}>
          <FilterContent {...filterState} onApply={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}
