import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import CategorySidebar from "@/components/Categories/CategorySidebar";
import CategoryBanner from "@/components/Categories/CategoryBanner ";
import ProductCard from "@/components/ProductCard";
import { client } from "@/sanity/lib/client";
import {
  CATEGORY_COUNTS_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
} from "@/sanity/lib/queries";
import ProductFilter from "@/components/Filters/ProductFilter";
import FilterDrawer from "@/components/Filters/FilterDrawer";
import Pagination from "@/components/Pagination";
import ProductCardWide from "@/components/Products/ProductCardWide";

export const revalidate = 0;

const ITEMS_PER_PAGE = 8;

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
      parent->{ _id, label, slug }
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
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const [allCategories, categoryCounts, category, allProducts] =
    await Promise.all([
      getAllCategories(),
      getCategoryCounts(),
      getCategory(subcategory),
      client.fetch(PRODUCTS_BY_CATEGORY_QUERY, { slug: subcategory }),
    ]);

  if (!category) notFound();

  const products = allProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const isWide = category.displayStyle === "wide";

  return (
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
            salePercentage={65}
            countdownEndDate={new Date(Date.now() + 1000 * 60 * 60 * 48)}
          />

          <div className="lg:hidden mt-4">
            <FilterDrawer />
          </div>

          <div className="mt-6">
            <h2 className="text-3xl font-bold mb-2">{category.label}</h2>
            <p className="text-gray-500">
              {allProducts.length} product{allProducts.length !== 1 ? "s" : ""}
            </p>

            {products.length > 0 ? (
              isWide ? (
                <div className="mt-4 flex flex-col gap-4">
                  {products.map((product: any) => (
                    <ProductCardWide key={product._id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} {...product} />
                  ))}
                </div>
              )
            ) : (
              <div className="col-span-full py-20 text-center border rounded-2xl text-gray-400 mt-4">
                No products in this category yet.
              </div>
            )}

            <Suspense fallback={null}>
              <Pagination totalItems={allProducts.length} itemsPerPage={ITEMS_PER_PAGE} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}