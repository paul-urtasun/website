import { defineField, defineType } from "sanity";

export const imageItem = defineType({
  name: "imageItem",
  title: "Image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Short description for screen readers and search engines.",
    }),
  ],
});
