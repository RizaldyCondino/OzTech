import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const brandSchema = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
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
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured Brand",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
});