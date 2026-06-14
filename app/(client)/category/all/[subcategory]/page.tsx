import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import CategorySidebar from "@/components/Categories/CategorySidebar";
import CategoryBanner from "@/components/Categories/CategoryBanner ";
import { client } from "@/sanity/lib/client";
import {
  CATEGORY_COUNTS_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
} from "@/sanity/lib/queries";
import ProductFilter from "@/components/Filters/ProductFilter";
import FilterDrawer from "@/components/Filters/FilterDrawer";
import { FilterProvider } from "@/components/Filters/FilterProvider";
import CategoryProductResults from "@/components/Categories/CategoryProductResults";

export const revalidate = 0;

interface ProductListItem {
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

const getAllCategories = unstable_cache(
  async () =>
    client.fetch(`
      *[_type == "category"] | order(coalesce(order, 999) asc) {
        _id, label, slug, description, image,
        parent->{ _id, label, slug }
      }
    `),
  ["all-categories"],
  { revalidate: 60 }
);

const getCategoryCounts = unstable_cache(
  async () => {
    const rows: {
      _id: string;
      isParent: boolean;
      count: number;
      productCount: number;
    }[] = await client.fetch(CATEGORY_COUNTS_QUERY);
    return Object.fromEntries(
      rows.map(({ _id, isParent, count, productCount }) => [
        _id,
        isParent ? count : productCount,
      ])
    );
  },
  ["category-counts"],
  { revalidate: 60 }
);

async function getCategory(slug: string) {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      _id, label, slug, description, image, displayStyle,
      parent->{ _id, label, slug, description, image }
    }`,
    { slug },
    { cache: "no-store" }
  );
}

export default async function SubcategoryPage({ params, searchParams }: {
  params: Promise<{ subcategory: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { subcategory } = await params;
  await searchParams;

  const [allCategories, categoryCounts, category, allProducts] =
    await Promise.all([
      getAllCategories(),
      getCategoryCounts(),
      getCategory(subcategory),
      client.fetch<ProductListItem[]>(PRODUCTS_BY_CATEGORY_QUERY, { slug: subcategory }),
    ]);

  if (!category) notFound();

  const brands = [...new Set(allProducts.map((p) => p.brand?.name).filter(Boolean))] as string[];

  return (
    <FilterProvider brands={brands}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:flex lg:w-72 flex-shrink-0 flex-col gap-4 sticky top-8 self-start">
            <CategorySidebar
              categories={allCategories}
              activeSlug={subcategory}
              counts={categoryCounts}
              basePath="/category/all"
            />
            <ProductFilter />
          </div>

          <div className="flex-1 min-w-0">
            <CategoryBanner
              category={category.parent ?? category}
            />

            <div className="lg:hidden mt-4">
              <FilterDrawer />
            </div>

            <div className="mt-6">
              <h2 className="text-3xl font-bold mb-2">{category.label}</h2>
              <p className="text-gray-500">
                {allProducts.length} product{allProducts.length !== 1 ? "s" : ""}
              </p>

              <Suspense fallback={null}>
                <CategoryProductResults products={allProducts} displayStyle={category.displayStyle} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
}
