import ProductSingle from "@/components/Products/ProductSingle";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";


const PRODUCT_QUERY = `
  *[_type == "product" && slug.current == $slug][0]{
    _id, name, slug, price, compareAtPrice, badge, inStock, featured,
    shortDescription, description, specs, variants,
    images[]{ asset, alt },
    "brand": brand->{ name, slug },
    "category": category->{ label, slug }
  }
`;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await client.fetch(PRODUCT_QUERY, { slug });
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProductSingle {...product} />
    </div>
  );
}