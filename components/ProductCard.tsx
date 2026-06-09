// components/Products/ProductCard.tsx
"use client"; 
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  compareAtPrice?: number;
  badge?: "HOT" | "NEW" | "SALE" | "BEST_SELLER";
  inStock?: boolean;
  images?: Array<{ asset: any; alt?: string }>;
  brand?: { name: string };
}

const BADGE_STYLES: Record<string, string> = {
  HOT:         "bg-orange-500 text-white",
  NEW:         "bg-blue-500 text-white",
  SALE:        "bg-red-500 text-white",
  BEST_SELLER: "bg-purple-600 text-white",
};

const BADGE_LABELS: Record<string, string> = {
  HOT:         "Hot",
  NEW:         "New",
  SALE:        "Sale",
  BEST_SELLER: "Best Seller",
};

export default function ProductCard({
  name,
  slug,
  price,
  compareAtPrice,
  badge,
  inStock = true,
  images,
  brand,
}: ProductCardProps) {
  const mainImage = images?.[0];
  const imageUrl = mainImage?.asset
    ? urlFor(mainImage).width(400).height(400).fit("crop").crop("center").url()
    : null;

  const discountPct =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  return (
    <Link
      href={`/product/${slug.current}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-100
                 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={mainImage?.alt ?? name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full
                        tracking-wide ${BADGE_STYLES[badge]}`}
          >
            {BADGE_LABELS[badge]}
          </span>
        )}

        {/* Out of Stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-1">
        {brand && (
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            {brand.name}
          </p>
        )}

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {name}
        </h3>

        {/* Pricing */}
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-xs text-gray-400 line-through">
                ${compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          {discountPct && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
              −{discountPct}%
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={(e) => {
            e.preventDefault(); // keep Link from firing
            // TODO: dispatch to cart store
          }}
          disabled={!inStock}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                     text-sm font-medium transition-colors
                     bg-[#303655] text-white hover:bg-[#3d4470]
                     disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={14} />
          {inStock ? "Add to cart" : "Unavailable"}
        </button>
      </div>
    </Link>
  );
}