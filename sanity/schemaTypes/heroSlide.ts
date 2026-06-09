import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const heroSlideSchema = defineType({
  name: "heroSlide",
  title: "Hero Slide",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      description: "Used only in the Studio to identify this slide",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "accentColor",
      title: "Slide Accent Color",
      type: "string",
      description: "Hex color — used for the peek card background (e.g. #C4B0D8 for purple, #F4C9B8 for peach)",
      initialValue: "#C4B0D8",
    }),
    defineField({
      name: "categoryTag",
      title: "Category Tag",
      type: "string",
      description: 'Small label above headline (e.g. "HOT PRODUCTS")',
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: 'Main bold text (e.g. "Fill your desk full of technology")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subLabel",
      title: "Sub Label",
      type: "string",
      description: 'Small text before the price (e.g. "Start from")',
      initialValue: "Start from",
    }),
    defineField({
      name: "startingPrice",
      title: "Starting Price (USD)",
      type: "number",
      description: "Displayed in orange accent text",
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "string",
      initialValue: "LEARN MORE",
    }),
    defineField({
      name: "ctaHref",
      title: "CTA Button Link",
      type: "string",
      initialValue: "#products",
    }),
    defineField({
      name: "linkedProduct",
      title: "Linked Product",
      type: "reference",
      to: [{ type: "product" }],
      description: "Optional — links the slide to a specific product",
    }),
    defineField({
      name: "order",
      title: "Slide Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide this slide without deleting it",
    }),
  ],
  orderings: [
    {
      title: "Slide Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "headline",
      media: "image",
    },
  },
});