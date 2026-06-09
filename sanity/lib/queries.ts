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
    "images": images[]{
      asset,
      alt
    },
    "brand": brand->{ name, slug },
    "category": category->{ label, slug }
  }
`;

// lib/queries.ts

export const CATEGORY_COUNTS_QUERY = `
  *[_type == "product"] {
    "categoryId": category->_id,
    "parentId": category->parent->_id
  }
`;