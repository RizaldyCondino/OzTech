// components/Products/ProductGridSection.tsx

import ProductCardWide from "@/components/Products/ProductCardWide";
import ProductCard from "../ProductCard";

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

interface Product {
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
  sku?: string;
  rating?: number;
  reviewCount?: number;
  freeDelivery?: boolean;
  voucherPct?: number;
}

interface ProductGridSectionProps {
  products: Product[];
  displayStyle?: "grid" | "wide";
}

export default function ProductGridSection({
  products,
  displayStyle = "grid",
}: ProductGridSectionProps) {
  if (displayStyle === "wide") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductCardWide key={product._id} {...product} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  );
}