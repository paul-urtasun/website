import { defineArrayMember, defineField, defineType } from "sanity";

export const selectionItem = defineType({
  name: "selectionItem",
  title: "Selection Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "facts",
      title: "Facts",
      type: "array",
      of: [defineArrayMember({ type: "factItem" })],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageItem",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});
