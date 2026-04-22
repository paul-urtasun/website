import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("interiorProject").title("Interiors"),
      S.documentTypeListItem("selectionItem").title("Selection"),
      S.divider(),
      S.listItem()
        .title("Information")
        .schemaType("information")
        .child(
          S.document()
            .schemaType("information")
            .documentId("information")
            .title("Information"),
        ),
    ]);
