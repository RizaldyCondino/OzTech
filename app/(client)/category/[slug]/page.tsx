import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import CategoryBanner from "@/components/Categories/CategoryBanner ";
import CategorySidebar from "@/components/Categories/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import ProductCardWide from "@/components/Products/ProductCardWide";
import { client } from "@/sanity/lib/client";
import {
  CATEGORY_COUNTS_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
} from "@/sanity/lib/queries";
import ProductFilter from "@/components/Filters/ProductFilter";
import FilterDrawer from "@/components/Filters/FilterDrawer";
import Pagination from "@/components/Pagination";


export const revalidate = 60;

const ITEMS_PER_PAGE = 8;

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
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      _id, label, slug, description, image, displayStyle,
      parent->{ _id, label, slug }
    }`,
    { slug }
  );
}

async function getProductsByCategory(slug: string) {
  return client.fetch(PRODUCTS_BY_CATEGORY_QUERY, { slug });
}

async function getAllProducts() {
  return client.fetch(`
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
  basePath = "/category",
  children,
}: {
  allCategories: any[];
  categoryCounts: Record<string, number>;
  activeSlug: string;
  basePath?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:flex lg:w-72 flex-shrink-0 flex-col gap-4 sticky top-8 self-start">
          <CategorySidebar
            categories={allCategories}
            activeSlug={activeSlug}
            counts={categoryCounts}
            basePath={basePath}
          />
          <ProductFilter />
        </div>
        <div className="flex-1 min-w-0">
          <div className="lg:hidden">
            <FilterDrawer />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function ProductGrid({
  products,
  displayStyle = "grid",
}: {
  products: any[];
  displayStyle?: "grid" | "wide";
}) {
  if (products.length === 0) {
    return (
      <div className="mt-4 py-20 text-center border rounded-2xl text-gray-400">
        No products in this category yet.
      </div>
    );
  }

  if (displayStyle === "wide") {
    return (
      <div className="mt-4 flex flex-col gap-4">
        {products.map((product) => (
          <ProductCardWide key={product._id} {...product} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  if (slug === "all") {
    const [allCategories, categoryCounts, allProducts] = await Promise.all([
      getAllCategories(),
      getCategoryCounts(),
      getAllProducts(),
    ]);

    const products = allProducts.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );

    return (
      <PageLayout
        allCategories={allCategories}
        categoryCounts={categoryCounts}
        activeSlug="all"
        basePath="/category/all"
      >
        <h2 className="text-3xl font-bold mb-2">All Products</h2>
        <p className="text-gray-500">
          {allProducts.length} product{allProducts.length !== 1 ? "s" : ""}
        </p>
        <ProductGrid products={products} />
        <Suspense fallback={null}>
          <Pagination totalItems={allProducts.length} itemsPerPage={ITEMS_PER_PAGE} />
        </Suspense>
      </PageLayout>
    );
  }

  const [category, allProducts] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
  ]);

  if (!category) notFound();

  const products = allProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CategoryBanner
        category={category}
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
        <ProductGrid products={products} displayStyle={category.displayStyle} />
        <Suspense fallback={null}>
          <Pagination totalItems={allProducts.length} itemsPerPage={ITEMS_PER_PAGE} />
        </Suspense>
      </div>
    </div>
  );
}