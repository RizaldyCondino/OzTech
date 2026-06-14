"use client";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { ShoppingCart, Heart, Truck, ShieldCheck } from "lucide-react";
import { useState } from "react";

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

interface ProductCardWideProps {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  compareAtPrice?: number | null;
  badge?: "HOT" | "NEW" | "SALE" | "BEST_SELLER" | null;
  inStock?: boolean;
  featured?: boolean;
  images?: ProductImage[];
  brand?: { name: string; slug?: { current: string } };
  category?: { label: string; slug?: { current: string } };
  shortDescription?: string;
  specs?: Spec[];
  variants?: VariantGroup[];
}

const BADGE_STYLES: Record<string, string> = {
  HOT: "bg-orange-500 text-white",
  NEW: "bg-blue-500 text-white",
  SALE: "bg-red-500 text-white",
  BEST_SELLER: "bg-purple-600 text-white",
};

const BADGE_LABELS: Record<string, string> = {
  HOT: "Hot",
  NEW: "New",
  SALE: "Sale",
  BEST_SELLER: "Best Seller",
};

export default function ProductCardWide({
  name,
  slug,
  price,
  compareAtPrice,
  badge,
  inStock = true,
  featured = false,
  images,
  brand,
  category,
  shortDescription,
  specs,
  variants,
}: ProductCardWideProps) {
  const [favorited, setFavorited] = useState(false);

  const mainImage = images?.[0];
  const imageUrl = mainImage?.asset
    ? urlFor(mainImage).width(600).height(450).fit("crop").crop("center").url()
    : null;

  const discountPct =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const previewSpecs = specs?.slice(0, 5);
  const mobilePreviewSpecs = specs?.slice(0, 2);

  const variantSummaries = (variants ?? []).map((group) => {
    const inStockCount = group.values.filter((v) => v.inStock).length;
    return {
      key: group._key,
      label: group.optionName,
      count: group.values.length,
      inStockCount,
    };
  });

  return (
    <Link
      href={`/product/${slug.current}`}
      className="group relative flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full"
    >
      {/* Featured ribbon */}
      {featured && (
        <div className="absolute top-0 right-0 z-10 bg-[#303655] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl tracking-widest uppercase">
          Featured
        </div>
      )}

      {/* Image - Square on mobile, Wide on desktop */}
      <div className="relative w-full sm:w-64 aspect-square sm:aspect-auto flex-shrink-0 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={mainImage?.alt ?? name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 256px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}

        {badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full tracking-wide ${BADGE_STYLES[badge]}`}
          >
            {BADGE_LABELS[badge]}
          </span>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 gap-4 min-w-0">
        {/* Top Info */}
        <div className="flex flex-col flex-1 gap-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {category?.label && (
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-full">
                {category.label}
              </span>
            )}
            {brand?.name && <span className="text-xs font-medium text-orange-500">{brand.name}</span>}
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight line-clamp-2">
            {name}
          </h3>

          {shortDescription ? (
            <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">
              {shortDescription}
            </p>
          ) : (
            <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2">
              {mobilePreviewSpecs?.map((s) => s.value).join(" · ")}
            </p>
          )}

          {/* Specs - More on desktop, fewer on mobile */}
          {(previewSpecs && previewSpecs.length > 0) && (
            <div className="mt-1 hidden sm:block">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Key Specifications
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] text-gray-600">
                {previewSpecs.map((spec) => (
                  <li key={spec._key} className="flex items-start gap-2" title={`${spec.key}: ${spec.value}`}>
                    <span className="font-medium text-gray-700 shrink-0 w-[78px] text-right">
                      {spec.key}:
                    </span>
                    <span className="line-clamp-1 flex-1 min-w-0 break-words">
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {variantSummaries.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {variantSummaries.map((v) => (
                <span
                  key={v.key}
                  className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
                >
                  {v.count} {v.label.toLowerCase()}
                  {v.count !== 1 ? "s" : ""}
                  {v.inStockCount < v.count && ` (${v.inStockCount} in stock)`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Left: Trust Signals (visible on all sizes) */}
          <div className="flex flex-col gap-0.5 text-[11px] text-gray-500 flex-shrink-0">
            <span className="flex items-center gap-1">
              <Truck size={13} /> Free Delivery
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} /> 1-Year Warranty
            </span>
          </div>

          {/* Right: Price + Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            {/* Price */}
            <div className="flex flex-col items-start sm:items-end">
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-xs text-gray-400 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-orange-500">
                  ${price.toFixed(2)}
                </span>
                {discountPct && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    −{discountPct}%
                  </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => e.preventDefault()}
                disabled={!inStock}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-medium 
                           bg-[#303655] text-white hover:bg-[#3d4470] disabled:bg-gray-200 transition-colors"
              >
                <ShoppingCart size={16} />
                {inStock ? "Add to Cart" : "Unavailable"}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setFavorited((prev) => !prev);
                }}
                className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all ${
                  favorited
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart size={18} className={favorited ? "fill-red-500" : ""} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}