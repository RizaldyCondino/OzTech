// components/Products/ProductCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { ShoppingCart } from "lucide-react";

interface VariantValue {
  _key: string;
  label: string;
  priceModifier: number;
  inStock: boolean;
}

interface VariantGroup {
  _key: string;
  optionName: string;
  values: VariantValue[];
}

interface Spec {
  _key: string;
  key: string;
  value: string;
}

interface ProductImage {
  _key?: string;
  asset: { _ref: string; _type: "reference" };
  alt?: string;
}

interface ProductCardProps {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  compareAtPrice?: number | null;
  badge?: "HOT" | "NEW" | "SALE" | "BEST_SELLER" | null;
  inStock?: boolean;
  featured?: boolean;
  images?: ProductImage[];
  brand?: { name: string };
  shortDescription?: string;
  specs?: Spec[];
  variants?: VariantGroup[];
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
  featured = false,
  images,
  brand,
  shortDescription,
  specs,
  variants,
}: ProductCardProps) {
  const mainImage = images?.[0];
  const imageUrl = mainImage?.asset
    ? urlFor(mainImage).width(400).height(400).fit("crop").crop("center").url()
    : null;

  const discountPct =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  // First variant group label summary, e.g. "3 colors"
  const firstVariant = variants?.[0];
  const variantSummary = firstVariant
    ? `${firstVariant.values.length} ${firstVariant.optionName.toLowerCase()}${firstVariant.values.length !== 1 ? "s" : ""}`
    : null;

  // Quick-glance specs — show first 2 only
  const previewSpecs = specs?.slice(0, 2);

  return (
    <Link
      href={`/product/${slug.current}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-100
                 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      {/* Featured ribbon */}
      {featured && (
        <div className="absolute top-0 right-0 z-10 bg-[#303655] text-white text-[9px]
                        font-bold px-3 py-1 rounded-bl-xl tracking-widest uppercase">
          Featured
        </div>
      )}

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

        {/* Short description */}
        {shortDescription && (
          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-0.5">
            {shortDescription}
          </p>
        )}

        {/* Quick specs */}
        {previewSpecs && previewSpecs.length > 0 && (
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {previewSpecs.map((spec) => (
              <li key={spec._key} className="flex items-center gap-1 text-[11px] text-gray-500">
                <span className="font-medium text-gray-700">{spec.key}:</span>
                <span className="truncate">{spec.value}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Variant summary */}
        {variantSummary && (
          <p className="text-[11px] text-gray-400 mt-1">{variantSummary}</p>
        )}

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
            e.preventDefault();
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