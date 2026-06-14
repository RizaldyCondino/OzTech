"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  totalItems: number;
  itemsPerPage?: number;
}

export default function Pagination({ totalItems, itemsPerPage = 12 }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") ?? 1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,        // ← Prevents scrolling to top
    });
  };

  // Build page number array with ellipsis
  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {/* Prev */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200
                   text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200
                   disabled:hover:text-gray-500"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages */}
      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(Number(page))}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium
                        transition-colors
                        ${currentPage === page
                          ? "bg-orange-500 text-white shadow-sm"
                          : "border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200
                   text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200
                   disabled:hover:text-gray-500"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}