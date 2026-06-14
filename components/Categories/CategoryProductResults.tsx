"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductCardWide from "@/components/Products/ProductCardWide";
import Pagination from "@/components/Pagination";
import { useSharedFilterState } from "@/components/Filters/FilterProvider";
import type { FilterableProduct } from "@/components/Filters/useFilterState";

const ITEMS_PER_PAGE = 8;

interface ProductListItem extends FilterableProduct {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  compareAtPrice?: number | null;
  badge?: "HOT" | "NEW" | "SALE" | "BEST_SELLER" | null;
  inStock?: boolean;
  featured?: boolean;
  images?: {
    _key?: string;
    asset: { _ref: string; _type: "reference" };
    alt?: string;
  }[];
  brand?: { name: string; slug?: { current: string } };
  category?: { label: string; slug?: { current: string } };
  shortDescription?: string;
  specs?: { _key: string; key: string; value: string }[];
  variants?: {
    _key: string;
    optionName: string;
    values: {
      _key: string;
      label: string;
      priceModifier: number;
      inStock: boolean;
    }[];
  }[];
}

export default function CategoryProductResults({
  products,
  displayStyle = "grid",
}: {
  products: ProductListItem[];
  displayStyle?: "grid" | "wide";
}) {
  const filterState = useSharedFilterState();
  const searchParams = useSearchParams();
  const requestedPage = Math.max(1, Number(searchParams.get("page") ?? 1));
  const filtered = filterState?.filterProducts(products) ?? products;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const visibleProducts = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (filtered.length === 0) {
    return (
      <div className="mt-4 py-20 text-center border rounded-2xl text-gray-400">
        No products match your filters.
      </div>
    );
  }

  return (
    <>
      {displayStyle === "wide" ? (
        <div className="mt-4 flex flex-col gap-4">
          {visibleProducts.map((product) => (
            <ProductCardWide key={product._id} {...product} />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      )}
      <Pagination totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
    </>
  );
}
