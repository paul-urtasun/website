"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import {
  apiVersion,
  studioDataset,
  studioProjectId,
} from "./src/sanity/env";

export default defineConfig({
  name: "paul-urtasun",
  title: "Paul Urtasun",
  basePath: "/studio",
  projectId: studioProjectId,
  dataset: studioDataset,
  apiVersion,
  plugins: [
    structureTool({
      structure,
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => template.schemaType !== "information"),
  },
});
