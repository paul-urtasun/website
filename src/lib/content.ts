import { sanityFetch } from "@/sanity/lib/client";
import {
  INFORMATION_QUERY,
  INTERIOR_PROJECT_QUERY,
  INTERIOR_PROJECTS_QUERY,
  SELECTION_ITEM_QUERY,
  SELECTION_ITEMS_QUERY,
} from "@/sanity/lib/queries";

export interface FactItem {
  label: string;
  value: string;
}

export interface InteriorProject {
  slug: string;
  title: string;
  year: string;
  type: string;
  location: string;
  description: string;
  facts: FactItem[];
  /** First image is used as the listing thumbnail and detail hero backdrop. */
  gallery: string[];
}

export type SelectionAspect = "portrait" | "landscape" | "square";

export interface SelectionPiece {
  slug: string;
  title: string;
  description: string;
  facts: FactItem[];
  image: string;
  aspect: SelectionAspect;
}

export interface Profile {
  bio: string;
  email: string;
  phone: string;
  address: string;
  portrait: string;
  /** Short line under the portrait on the Information page. */
  portraitCaption: string;
}

type StubInteriorProject = Omit<InteriorProject, "facts">;

interface StubSelectionPiece extends Omit<SelectionPiece, "facts"> {
  material: string;
  year: string;
}

type SanityFact = {
  label?: string | null;
  value?: string | null;
};

type SanityImageDimensions = {
  width?: number | null;
  height?: number | null;
  aspectRatio?: number | null;
};

type SanityImage = {
  url?: string | null;
  alt?: string | null;
  dimensions?: SanityImageDimensions | null;
};

type SanityInteriorProject = {
  title?: string | null;
  slug?: string | null;
  year?: string | null;
  type?: string | null;
  location?: string | null;
  description?: string | null;
  facts?: SanityFact[] | null;
  images?: SanityImage[] | null;
};

type SanitySelectionItem = {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  facts?: SanityFact[] | null;
  image?: SanityImage | null;
};

type SanityInformation = {
  bio?: string | null;
  contact?: {
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  } | null;
  portrait?: SanityImage | null;
  portraitCaption?: string | null;
};

// Deterministic placeholder images. Sanity data overrides these when configured.
const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const INTERIORS: StubInteriorProject[] = [
  {
    slug: "biarritz-apartment",
    title: "Biarritz Apartment",
    type: "Residential",
    location: "Biarritz, France",
    year: "2025",
    description:
      "A coastal apartment reimagined around natural light and tactile finishes. The living spaces are anchored by hand-finished plaster walls and a palette drawn from the Atlantic shore.",
    gallery: [
      img("pu-biarritz-1", 1600, 1066),
      img("pu-biarritz-2", 1200, 1500),
      img("pu-biarritz-3", 1600, 1066),
      img("pu-biarritz-4", 1200, 1500),
    ],
  },
  {
    slug: "mamani-restaurant",
    title: "Mamani",
    type: "Hospitality",
    location: "Dallas, Texas",
    year: "2024",
    description:
      "Mamani, one of Dallas's first Michelin-starred restaurants, anchors the new Quad development in Uptown. The brief called for a contemporary, elevated setting with subtle gestures to the French traditions behind the cuisine. The main dining room is organised around an open kitchen, where glazed lavastone, unlacquered brass, and textured glass highlight the work of the chef's team.",
    gallery: [
      img("pu-mamani-1", 1600, 1066),
      img("pu-mamani-2", 1200, 1500),
      img("pu-mamani-3", 1600, 1066),
    ],
  },
  {
    slug: "tribeca-loft",
    title: "Tribeca Loft",
    type: "Residential",
    location: "New York, NY",
    year: "2024",
    description:
      "A pre-war loft reorganised around a single sculptural kitchen island. Original cast-iron columns were stripped and waxed; new walnut joinery was added in deliberate counterpoint.",
    gallery: [
      img("pu-tribeca-1", 1600, 1066),
      img("pu-tribeca-2", 1200, 1500),
      img("pu-tribeca-3", 1600, 1066),
    ],
  },
  {
    slug: "bilbao-house",
    title: "Bilbao House",
    type: "Residential",
    location: "Bilbao, Spain",
    year: "2023",
    description:
      "A family house in the Basque hills. Limewashed walls, reclaimed chestnut floors, and a quiet sequence of rooms that open onto a single courtyard.",
    gallery: [
      img("pu-bilbao-1", 1600, 1066),
      img("pu-bilbao-2", 1200, 1500),
      img("pu-bilbao-3", 1600, 1066),
    ],
  },
  {
    slug: "marylebone-flat",
    title: "Marylebone Flat",
    type: "Residential",
    location: "London, UK",
    year: "2022",
    description:
      "A compact London flat treated as a single continuous room. Built-in joinery in fumed oak, a small library wall, and a kitchen tucked behind a sliding screen.",
    gallery: [
      img("pu-marylebone-1", 1600, 1066),
      img("pu-marylebone-2", 1200, 1500),
      img("pu-marylebone-3", 1600, 1066),
    ],
  },
];

const SELECTION: StubSelectionPiece[] = [
  {
    slug: "atelier-martine-side-table",
    title: "Atelier Martine Side Table",
    description:
      "The unique crushed treatment of the leather combined with the soft touch of goatskin offers an experience where individuality meets refinement.",
    material: "Leather, Goatskin",
    year: "2003",
    image: img("sel-atelier-martine", 800, 1000),
    aspect: "portrait",
  },
  {
    slug: "carpentier-fauteuils",
    title: "Carpentier Fauteuils",
    description:
      "A pair of low lounge chairs in their original mohair upholstery, attributed to Carpentier, France, c. 1955.",
    material: "Mohair, Beech",
    year: "1955",
    image: img("sel-carpentier", 1200, 800),
    aspect: "landscape",
  },
  {
    slug: "mirror-i",
    title: "Mirror I",
    description:
      "A tall hand-bevelled mirror in a slim brass frame, attributed to a Milanese workshop, c. 1968.",
    material: "Mirror, Brass",
    year: "1968",
    image: img("sel-mirror", 800, 1100),
    aspect: "portrait",
  },
  {
    slug: "green-chambost-vase",
    title: "Green Chambost Vase",
    description:
      "An emerald-glazed stoneware vase by Pol Chambost, signed and dated, with rich tonal variation across the body.",
    material: "Glazed stoneware",
    year: "1962",
    image: img("sel-chambost", 900, 900),
    aspect: "square",
  },
  {
    slug: "italian-console-table",
    title: "Italian Console Table",
    description:
      "A long Italian console in walnut and travertine, with a single floating shelf and tapered legs.",
    material: "Walnut, Travertine",
    year: "1971",
    image: img("sel-console", 1300, 900),
    aspect: "landscape",
  },
  {
    slug: "louis-xvi-console-table",
    title: "Louis XVI Console Table",
    description:
      "A demi-lune console in carved giltwood with a marble top, late 18th century, French.",
    material: "Giltwood, Marble",
    year: "c. 1785",
    image: img("sel-louis-xvi", 1300, 900),
    aspect: "landscape",
  },
  {
    slug: "eames-chair-ottoman",
    title: "Eames Chair & Ottoman",
    description:
      "An early production lounge chair and ottoman in rosewood and black leather, with original down cushions.",
    material: "Rosewood, Leather",
    year: "1958",
    image: img("sel-eames", 1300, 900),
    aspect: "landscape",
  },
  {
    slug: "claude-bouscau",
    title: "Claude Bouscau (1909–1985)",
    description:
      "A figural carved oak sculpture by Claude Bouscau, with a rich patina developed over decades.",
    material: "Carved oak",
    year: "1948",
    image: img("sel-bouscau", 1300, 900),
    aspect: "landscape",
  },
  {
    slug: "adler-sullivan-transom",
    title: "Adler & Sullivan Transom",
    description:
      "A pierced and gilded transom panel from a Chicago commercial building by Adler & Sullivan.",
    material: "Iron, Gilt",
    year: "1894",
    image: img("sel-adler", 800, 1100),
    aspect: "portrait",
  },
  {
    slug: "paedra-bamhall-glass-orb",
    title: "Paedra Bamhall Glass Orb",
    description:
      "A hand-blown glass orb with a fine internal lattice, by Paedra Bamhall, signed.",
    material: "Hand-blown glass",
    year: "2019",
    image: img("sel-bamhall", 1200, 900),
    aspect: "landscape",
  },
  {
    slug: "saint-laurent-mannequin",
    title: "Yves Saint Laurent",
    description:
      "A studio mannequin from the Saint Laurent atelier, with original linen wrap.",
    material: "Linen, Wood",
    year: "1976",
    image: img("sel-saint-laurent", 700, 1100),
    aspect: "portrait",
  },
  {
    slug: "louis-xv-armchair",
    title: "Louis XV Armchair",
    description:
      "A bergère in carved beech with original silk damask upholstery, French, mid-18th century.",
    material: "Beech, Silk",
    year: "c. 1755",
    image: img("sel-louis-xv", 900, 900),
    aspect: "square",
  },
];

const PROFILE: Profile = {
  bio: "Rooted in Bilbao, shaped by a childhood in Biarritz, and refined through years in London before settling in New York, his work brings together European ease and urban sophistication. With a strong eye for texture, atmosphere, and quiet drama, he creates interiors that feel layered, personal, and deeply considered.",
  email: "studio@paulurtasun.com",
  phone: "+1 917 670 30 33",
  address: "New York, NY",
  portrait: "/images/paul-urtasun-information.png",
  portraitCaption: "Mixed-media portrait, oil and graphite on linen.",
};

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function nonEmptyString(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeFacts(facts: SanityFact[] | null | undefined): FactItem[] {
  return (
    facts
      ?.map((fact) => {
        const label = nonEmptyString(fact.label);
        const value = nonEmptyString(fact.value);
        return label && value ? { label, value } : null;
      })
      .filter(isNonNullable) ?? []
  );
}

function imageUrls(images: SanityImage[] | null | undefined): string[] {
  return (
    images
      ?.map((image) => nonEmptyString(image.url))
      .filter(isNonNullable) ?? []
  );
}

function aspectFromDimensions(
  dimensions: SanityImageDimensions | null | undefined,
): SelectionAspect {
  const ratio =
    dimensions?.aspectRatio ??
    (dimensions?.width && dimensions?.height
      ? dimensions.width / dimensions.height
      : 1);

  if (ratio > 1.12) return "landscape";
  if (ratio < 0.9) return "portrait";
  return "square";
}

function normalizeInterior(
  project: SanityInteriorProject | null | undefined,
): InteriorProject | null {
  const title = nonEmptyString(project?.title);
  const slug = nonEmptyString(project?.slug);
  const year = nonEmptyString(project?.year);
  const type = nonEmptyString(project?.type) ?? "";
  const location = nonEmptyString(project?.location) ?? "";
  const description = nonEmptyString(project?.description);
  const gallery = imageUrls(project?.images);

  if (!title || !slug || !year || !description || gallery.length === 0) {
    return null;
  }

  return {
    slug,
    title,
    year,
    type,
    location,
    description,
    facts: normalizeFacts(project?.facts).filter(
      (fact) =>
        !["type", "location"].includes(fact.label.trim().toLowerCase()),
    ),
    gallery,
  };
}

function normalizeSelection(
  item: SanitySelectionItem | null | undefined,
): SelectionPiece | null {
  const title = nonEmptyString(item?.title);
  const slug = nonEmptyString(item?.slug);
  const description = nonEmptyString(item?.description);
  const image = nonEmptyString(item?.image?.url);

  if (!title || !slug || !description || !image) return null;

  return {
    slug,
    title,
    description,
    facts: normalizeFacts(item?.facts),
    image,
    aspect: aspectFromDimensions(item?.image?.dimensions),
  };
}

function stubInterior(project: StubInteriorProject): InteriorProject {
  return {
    slug: project.slug,
    title: project.title,
    year: project.year,
    type: project.type,
    location: project.location,
    description: project.description,
    gallery: project.gallery,
    facts: [],
  };
}

function stubSelection(piece: StubSelectionPiece): SelectionPiece {
  return {
    slug: piece.slug,
    title: piece.title,
    description: piece.description,
    image: piece.image,
    aspect: piece.aspect,
    facts: [
      { label: "Material", value: piece.material },
      { label: "Year", value: piece.year },
    ],
  };
}

function fallbackInteriors() {
  return INTERIORS.map(stubInterior);
}

function fallbackSelection() {
  return SELECTION.map(stubSelection);
}

export async function getAllInteriors() {
  const projects = await sanityFetch<SanityInteriorProject[]>({
    query: INTERIOR_PROJECTS_QUERY,
  });
  const normalized = projects?.map(normalizeInterior).filter(isNonNullable);
  return normalized?.length ? normalized : fallbackInteriors();
}

export async function getInterior(slug: string) {
  const project = await sanityFetch<SanityInteriorProject | null>({
    query: INTERIOR_PROJECT_QUERY,
    params: { slug },
  });
  return (
    normalizeInterior(project) ??
    fallbackInteriors().find((item) => item.slug === slug) ??
    null
  );
}

export async function getAllSelection() {
  const items = await sanityFetch<SanitySelectionItem[]>({
    query: SELECTION_ITEMS_QUERY,
  });
  const normalized = items?.map(normalizeSelection).filter(isNonNullable);
  return normalized?.length ? normalized : fallbackSelection();
}

export async function getSelection(slug: string) {
  const item = await sanityFetch<SanitySelectionItem | null>({
    query: SELECTION_ITEM_QUERY,
    params: { slug },
  });
  return (
    normalizeSelection(item) ??
    fallbackSelection().find((piece) => piece.slug === slug) ??
    null
  );
}

export async function getProfile(): Promise<Profile> {
  const profile = await sanityFetch<SanityInformation | null>({
    query: INFORMATION_QUERY,
  });

  if (!profile) return PROFILE;

  return {
    bio: nonEmptyString(profile.bio) ?? PROFILE.bio,
    email: nonEmptyString(profile.contact?.email) ?? PROFILE.email,
    phone: nonEmptyString(profile.contact?.phone) ?? PROFILE.phone,
    address: nonEmptyString(profile.contact?.address) ?? PROFILE.address,
    portrait: nonEmptyString(profile.portrait?.url) ?? PROFILE.portrait,
    portraitCaption:
      nonEmptyString(profile.portraitCaption) ?? PROFILE.portraitCaption,
  };
}
