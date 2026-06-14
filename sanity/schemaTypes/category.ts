// schemas/category.ts
import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categorySchema = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "label", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Leave empty for main categories",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),

    // schemas/category.ts — add this field
defineField({
  name: "displayStyle",
  title: "Product Display Style",
  type: "string",
  options: {
    list: [
      { title: "Grid (default)", value: "grid" },
      { title: "Wide List",      value: "wide" },
    ],
    layout: "radio",
  },
  initialValue: "grid",
  description: "Wide List shows horizontal cards — best for computers & laptops",
}),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "label", media: "image", parent: "parent.label" },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: selection.parent ? `Sub of ${selection.parent}` : "Main Category",
        media: selection.media,
      };
    },
  },
});