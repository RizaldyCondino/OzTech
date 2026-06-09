import { defineField, defineType } from "sanity";
import { BasketIcon } from "@sanity/icons";

export const productSchema = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: BasketIcon,
  fields: [

    // ─── Identity ───────────────────────────────────────────
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
   // In productSchema — replace the brand field
defineField({
  name: "brand",
  title: "Brand",
  type: "reference",
  to: [{ type: "brand" }],
  validation: (Rule) => Rule.required(),
}),

    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      options: {
        list: [
          { title: "Hot",         value: "HOT" },
          { title: "New",         value: "NEW" },
          { title: "Sale",        value: "SALE" },
          { title: "Best Seller", value: "BEST_SELLER" },
        ],
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),

    // ─── Media ──────────────────────────────────────────────
    defineField({
      name: "images",
      title: "Product Images",
      description: "First image is the main shot; the rest become thumbnails",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),

    // ─── Pricing ────────────────────────────────────────────
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare At Price",
      type: "number",
      description: "Original price shown as strikethrough",
    }),

    // ─── Variants / Options ─────────────────────────────────
    defineField({
      name: "variants",
      title: "Variants / Options",
      type: "array",
      of: [
        {
          type: "object",
          name: "variantGroup",
          fields: [
            defineField({
              name: "optionName",
              title: "Option Name",
              type: "string",
              description: 'e.g. "Screen Size", "Color", "Storage"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "values",
              title: "Values",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "priceModifier",
                      title: "Price Modifier (USD)",
                      type: "number",
                      initialValue: 0,
                    }),
                    defineField({
                      name: "inStock",
                      title: "In Stock",
                      type: "boolean",
                      initialValue: true,
                    }),
                  ],
                  preview: {
                    select: { title: "label", subtitle: "priceModifier" },
                    prepare({ title, subtitle }) {
                      return {
                        title,
                        subtitle: subtitle
                          ? subtitle > 0 ? `+$${subtitle}` : `-$${Math.abs(subtitle)}`
                          : "No modifier",
                      };
                    },
                  },
                },
              ],
            }),
          ],
          preview: { select: { title: "optionName" } },
        },
      ],
    }),

    // ─── Content ────────────────────────────────────────────
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "key",   title: "Spec Name",  type: "string" }),
            defineField({ name: "value", title: "Spec Value", type: "string" }),
          ],
          preview: { select: { title: "key", subtitle: "value" } },
        },
      ],
    }),

    // ─── Editorial Flags ────────────────────────────────────
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title:    "name",
      subtitle: "price",
      media:    "images.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `$${subtitle}` : "No price",
        media,
      };
    },
  },
});