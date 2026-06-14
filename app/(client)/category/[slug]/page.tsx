import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import CategoryBanner from "@/components/Categories/CategoryBanner ";
import CategorySidebar from "@/components/Categories/CategorySidebar";
import { client } from "@/sanity/lib/client";
import {
  CATEGORY_COUNTS_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
} from "@/sanity/lib/queries";
import ProductFilter from "@/components/Filters/ProductFilter";
import FilterDrawer from "@/components/Filters/FilterDrawer";
import { FilterProvider } from "@/components/Filters/FilterProvider";
import CategoryProductResults from "@/components/Categories/CategoryProductResults";

export const revalidate = 60;

interface CategoryNavItem {
  _id: string;
  label: string;
  slug: { current: string };
  parent?: { _id: string; label: string; slug: { current: string } };
}

interface CategoryItem extends CategoryNavItem {
  description?: string;
  image?: { asset?: unknown };
  displayStyle?: "grid" | "wide";
}

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

export async function generateStaticParams() {
  const categories: { slug: { current: string } }[] = await client.fetch(
    `*[_type == "category"]{ slug }`
  );
  return [
    { slug: "all" },
    ...categories.map((c) => ({ slug: c.slug.current })),
  ];
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
    const rows: { _id: string; count: number; productCount: number }[] =
      await client.fetch(CATEGORY_COUNTS_QUERY);
    return Object.fromEntries(
      rows.map(({ _id, count, productCount }) => [
        _id,
        count > 0 ? count : productCount,
      ])
    );
  },
  ["category-counts"],
  { revalidate: 60 }
);
async function getCategory(slug: string) {
  return client.fetch<CategoryItem | null>(
    `*[_type == "category" && slug.current == $slug][0]{
      _id, label, slug, description, displayStyle,
      image,
      parent->{ _id, label, slug, description, image }
    }`,
    { slug }
  );
}

async function getProductsByCategory(slug: string) {
  return client.fetch<ProductListItem[]>(PRODUCTS_BY_CATEGORY_QUERY, { slug });
}

async function getAllProducts() {
  return client.fetch<ProductListItem[]>(`
    *[_type == "product"] | order(_createdAt desc) {
      _id, name, slug, price, compareAtPrice, badge, inStock, featured,
      images[]{ asset, alt },
      brand->{ name },
      shortDescription,
      specs,
      variants
    }
  `);
}

function PageLayout({
  allCategories,
  categoryCounts,
  activeSlug,
  brands,
  basePath = "/category",
  children,
}: {
  allCategories: CategoryNavItem[];
  categoryCounts: Record<string, number>;
  activeSlug: string;
  brands: string[];
  basePath?: string;
  children: React.ReactNode;
}) {
  return (
    <FilterProvider brands={brands}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {activeSlug === "all" && (
            <div className="hidden lg:flex lg:w-72 flex-shrink-0 flex-col gap-4 sticky top-8 self-start">
              <CategorySidebar
                categories={allCategories}
                activeSlug={activeSlug}
                counts={categoryCounts}
                basePath={basePath}
              />
              <ProductFilter />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="lg:hidden">
              <FilterDrawer />
            </div>
            {activeSlug !== "all" && (
              <div className="hidden lg:block">
                <FilterDrawer placement="right" />
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </FilterProvider>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "all") {
    const [allCategories, categoryCounts, allProducts] = await Promise.all([
      getAllCategories(),
      getCategoryCounts(),
      getAllProducts(),
    ]);

    const brands = [...new Set(allProducts.map((p) => p.brand?.name).filter(Boolean))] as string[];

    return (
      <PageLayout
        allCategories={allCategories}
        categoryCounts={categoryCounts}
        activeSlug="all"
        brands={brands}
        basePath="/category/all"
      >
        <h2 className="text-3xl font-bold mb-2">All Products</h2>
        <p className="text-gray-500">
          {allProducts.length} product{allProducts.length !== 1 ? "s" : ""}
        </p>
        <Suspense fallback={null}>
          <CategoryProductResults products={allProducts} />
        </Suspense>
      </PageLayout>
    );
  }

  const [category, allCategories, categoryCounts, allProducts] = await Promise.all([
    getCategory(slug),
    getAllCategories(),
    getCategoryCounts(),
    getProductsByCategory(slug),
  ]);

  if (!category) notFound();

  // parent->{ image } is now fetched directly in getCategory
  const parentCategory = category.parent ?? undefined;

  const brands = [...new Set(allProducts.map((p) => p.brand?.name).filter(Boolean))] as string[];

  return (
    <PageLayout
      allCategories={allCategories}
      categoryCounts={categoryCounts}
      activeSlug={slug}
      brands={brands}
      basePath="/category"
    >
      <CategoryBanner
        category={category}
        parentCategory={parentCategory}
      />
      <div className="mt-6">
        <h2 className="text-3xl font-bold mb-2">{category.label}</h2>
        <p className="text-gray-500">
          {allProducts.length} product{allProducts.length !== 1 ? "s" : ""}
        </p>
        <Suspense fallback={null}>
          <CategoryProductResults products={allProducts} displayStyle={category.displayStyle} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
