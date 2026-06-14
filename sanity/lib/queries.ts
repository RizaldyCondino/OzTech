export const PRODUCTS_BY_CATEGORY_QUERY = `
  *[
    _type == "product" &&
    (
      category->slug.current == $slug ||
      category->parent->slug.current == $slug
    )
  ] | order(_createdAt desc) {
    _id, 
    name, 
    slug, 
    price, 
    compareAtPrice,
    badge, 
    inStock, 
    featured,
    shortDescription,
    specs,                    // ← Add this
    variants,                 // ← Optional: also good to add
    "images": images[]{ asset, alt },
    "brand": brand->{ name, slug },
    "category": category->{ 
      label, 
      slug,
      "displayStyle": coalesce(parent->displayStyle, displayStyle)
    }
  }
`;

export const CATEGORY_COUNTS_QUERY = `
  *[_type == "category"] {
    "_id": _id,
    "isParent": !defined(parent),
    "count": count(*[_type == "product" && category->parent._ref == ^._id]),
    "productCount": count(*[_type == "product" && category._ref == ^._id])
  }
`;