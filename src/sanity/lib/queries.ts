import { defineQuery } from "next-sanity";

const IMAGE_PROJECTION = `{
  ...,
  "url": asset->url,
  "dimensions": asset->metadata.dimensions,
  "palette": asset->metadata.palette
}`;

export const INTERIOR_PROJECTS_QUERY = defineQuery(`
  *[_type == "interiorProject" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    year,
    type,
    location,
    description,
    facts[] {
      label,
      value
    },
    images[] ${IMAGE_PROJECTION}
  }
`);

export const INTERIOR_PROJECT_QUERY = defineQuery(`
  *[_type == "interiorProject" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    year,
    type,
    location,
    description,
    facts[] {
      label,
      value
    },
    images[] ${IMAGE_PROJECTION}
  }
`);

export const SELECTION_ITEMS_QUERY = defineQuery(`
  *[_type == "selectionItem" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    type,
    facts[] {
      label,
      value
    },
    image ${IMAGE_PROJECTION}
  }
`);

export const SELECTION_ITEM_QUERY = defineQuery(`
  *[_type == "selectionItem" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    type,
    facts[] {
      label,
      value
    },
    image ${IMAGE_PROJECTION}
  }
`);

export const INFORMATION_QUERY = defineQuery(`
  *[_type == "information"] | order(_id == "information" desc, _updatedAt desc)[0] {
    bio,
    contact {
      phone,
      email,
      address
    },
    portrait ${IMAGE_PROJECTION},
    portraitCaption
  }
`);
