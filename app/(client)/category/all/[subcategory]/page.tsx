// app/category/all/[subcategory]/page.tsx
import CategorySidebar from "@/components/Categories/CategorySidebar";
import CategoryBanner from "@/components/Categories/CategoryBanner ";
import ProductCard from "@/components/ProductCard";
import { client } from "@/sanity/lib/client";
import { CATEGORY_COUNTS_QUERY, PRODUCTS_BY_CATEGORY_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

async function getAllCategories() {
  return client.fetch(`
    *[_type == "category"] | order(coalesce(order, 999) asc) {
      _id, label, slug, description, image,
      parent->{ _id, label, slug }
    }
  `);
}

async function getCategory(slug: string) {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      _id, label, slug, description, image,
      parent->{ _id, label, slug }
    }`,
    { slug },
  );
}

async function getCategoryCounts() {
  const rows: { categoryId: string; parentId?: string }[] =
    await client.fetch(CATEGORY_COUNTS_QUERY);

  const counts: Record<string, number> = {};
  rows.forEach(({ categoryId, parentId }) => {
    if (categoryId) counts[categoryId] = (counts[categoryId] ?? 0) + 1;
    if (parentId)   counts[parentId]   = (counts[parentId]   ?? 0) + 1;
  });

  return counts;
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}) {
  const { subcategory } = await params;

  const [allCategories, categoryCounts, category] = await Promise.all([
    getAllCategories(),
    getCategoryCounts(),
    getCategory(subcategory),
  ]);

  if (!category) notFound();

  const products = await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, { slug: subcategory });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-72 flex-shrink-0">
          <CategorySidebar
            categories={allCategories}
            activeSlug={subcategory}
            counts={categoryCounts}
            basePath="/category/all"
          />
        </div>

        <div className="flex-1">
          <CategoryBanner
            category={category}
            salePercentage={65}
            countdownEndDate={new Date(Date.now() + 1000 * 60 * 60 * 48)}
          />

          <div className="mt-10">
            <h2 className="text-3xl font-bold mb-2">{category.label}</h2>
            <p className="text-gray-500">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product: any) => (
                  <ProductCard key={product._id} {...product} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center border rounded-2xl text-gray-400">
                  No products in this category yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}