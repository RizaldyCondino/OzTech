// components/Products/ProductSingle.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import {
  Star,
  CheckCircle2,
  Eye,
  Heart,
  Minus,
  Plus,
 
  ChevronUp,
  ChevronDown,
  Copy,
} from "lucide-react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

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

interface ProductSingleProps {
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
  shortDescription?: string;
  description?: any;
  specs?: Spec[];
  variants?: VariantGroup[];
  category?: { label: string; slug: { current: string } };
}

export default function ProductSingle({
  _id,
  name,
  price,
  compareAtPrice,
  inStock = true,
  images,
  brand,
  shortDescription,
  specs,
  variants,
  category,
}: ProductSingleProps) {
  const [favorited, setFavorited] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    variants?.forEach((group) => {
      const firstAvailable = group.values.find((v) => v.inStock) ?? group.values[0];
      if (firstAvailable) initial[group.optionName] = firstAvailable.label;
    });
    return initial;
  });

  const mainImage = images?.[activeImage] ?? images?.[0];
  const imageUrl = mainImage?.asset
    ? urlFor(mainImage).width(800).height(800).fit("crop").crop("center").url()
    : null;

  const priceModifierTotal =
    variants?.reduce((sum, group) => {
      const selectedLabel = selectedOptions[group.optionName];
      const value = group.values.find((v) => v.label === selectedLabel);
      return sum + (value?.priceModifier ?? 0);
    }, 0) ?? 0;

  const finalPrice = price + priceModifierTotal;

  const discountPct =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const selectedVariantsInStock =
    variants?.every((group) => {
      const selectedLabel = selectedOptions[group.optionName];
      const value = group.values.find((v) => v.label === selectedLabel);
      return value?.inStock ?? true;
    }) ?? true;

  const isAvailable = inStock && selectedVariantsInStock;

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium mb-6">
        <Link href="/" className="text-orange-500 hover:underline">
          Home
        </Link>
        <span className="text-gray-300">/</span>
        {category && (
          <>
            <Link
              href={`/category/${category.slug.current}`}
              className="text-orange-500 hover:underline"
            >
              {category.label}
            </Link>
            <span className="text-gray-300">/</span>
          </>
        )}
        <span className="text-gray-400">{name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-10">
        {/* ── Gallery ─────────────────────────────────────── */}
        <div className="flex gap-3">
          {/* Main image */}
          <div className="relative flex-1 aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={mainImage?.alt ?? name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
                No image
              </div>
            )}

            {!inStock && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border">
                  Out of stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail rail */}
          {images && images.length > 1 && (
            <div className="flex flex-col items-center gap-2 w-16">
              <button
                onClick={() =>
                  setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                }
                className="text-gray-300 hover:text-gray-500 transition-colors"
                aria-label="Previous image"
              >
                <ChevronUp size={18} />
              </button>

              <div className="flex flex-col gap-2 overflow-y-auto">
                {images.map((img, i) => {
                  const thumbUrl = urlFor(img).width(120).height(120).fit("crop").crop("center").url();
                  return (
                    <button
                      key={img._key ?? i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-xl border-2 bg-gray-50
                                  overflow-hidden transition-all
                                  ${activeImage === i
                                    ? "border-orange-400"
                                    : "border-gray-100 hover:border-gray-300"}`}
                    >
                      <Image
                        src={thumbUrl}
                        alt={img.alt ?? `${name} thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                }
                className="text-orange-500 hover:text-orange-600 transition-colors"
                aria-label="Next image"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          )}
        </div>

        {/* ── Details ─────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400 tracking-wide">SKU {_id.replace(/-/g, "").slice(0, 14)}</p>

          <h1 className="text-2xl font-bold text-gray-900 leading-snug">{name}</h1>

          {/* Rating / sold / viewed / wishlist row */}
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-700">4.0</span>
              <div className="flex items-center gap-0.5 text-orange-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < 4 ? "fill-orange-400" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <span className="text-gray-400">(223)</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500">
              <CheckCircle2 size={15} className="text-gray-400" />
              <span>4,320 Sold</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500">
              <Eye size={15} className="text-gray-400" />
              <span>1.4k Viewed</span>
            </div>

            <button
              onClick={() => setFavorited((prev) => !prev)}
              className={`flex items-center gap-1.5 ml-auto transition-colors
                          ${favorited ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
            >
              <Heart size={15} className={favorited ? "fill-red-500" : ""} />
              <span>Add to wishlist</span>
            </button>
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between border-y py-4 mt-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-orange-500">
                ${finalPrice.toFixed(2)}
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-base text-gray-400 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
              {discountPct && (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md">
                  {discountPct}%
                </span>
              )}
            </div>

            {brand && (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 font-bold text-sm">
                  {brand.name.charAt(0)}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-gray-800">{brand.name}</span>
                  <span className="text-[11px] text-gray-400">Official Store</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {shortDescription && (
            <p className="text-sm text-gray-500 leading-relaxed">{shortDescription}</p>
          )}

          {/* Specs bullets */}
          {specs && specs.length > 0 && (
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              {specs.map((spec) => (
                <li key={spec._key}>
                  - {spec.key}{spec.value ? `: ${spec.value}` : ""}
                </li>
              ))}
            </ul>
          )}

          {/* Variant selectors */}
          {variants?.map((group) => (
            <div key={group._key} className="mt-2">
              <p className="text-sm font-bold text-gray-800 mb-2">{group.optionName}</p>
              <div className="flex flex-wrap gap-3">
                {group.values.map((value) => {
                  const isSelected = selectedOptions[group.optionName] === value.label;
                  return (
                    <button
                      key={value._key}
                      disabled={!value.inStock}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [group.optionName]: value.label,
                        }))
                      }
                      className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all
                                  ${isSelected
                                    ? "border-orange-300 bg-orange-50 text-orange-500"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"}
                                  ${!value.inStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                    >
                      {value.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity + actions */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center border rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-gray-800">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              disabled={!isAvailable}
              className="h-11 px-8 rounded-xl border border-orange-400 text-orange-500
                         text-sm font-semibold hover:bg-orange-50 transition-colors
                         disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              Buy
            </button>

            <button
              disabled={!isAvailable}
              className="flex-1 h-11 rounded-xl text-sm font-bold tracking-wide uppercase
                         bg-orange-500 text-white hover:bg-orange-600 transition-colors
                         disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isAvailable ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>

      {/* Share row */}
      <div className="flex items-center gap-3 mt-6">
        <span className="text-sm text-gray-400">Share</span>
        <button className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
          <FaLinkedin size={15} />
        </button>
        <button className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center hover:bg-cyan-100 transition-colors">
          <FaTwitter size={15} />
        </button>
        <button className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
          <FaFacebook size={15} />
        </button>
        <button
          onClick={handleCopyLink}
          className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center hover:bg-orange-100 transition-colors"
        >
          <Copy size={15} />
        </button>
      </div>
    </div>
  );
}