import { defineField, defineType } from "sanity";

export const information = defineType({
  name: "information",
  title: "Information",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 8,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "phone",
          title: "Telephone number",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "email",
          title: "Email address",
          type: "email",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "address",
          title: "Address",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "imageItem",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portraitCaption",
      title: "Portrait caption",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Information",
      };
    },
  },
});
