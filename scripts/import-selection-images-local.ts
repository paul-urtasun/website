import { createReadStream } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";

const IMAGE_ROOT = "/Users/chrislawrence/Downloads/Images";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const STUB_DESCRIPTION = "Details forthcoming.";
const RETRIES = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetries<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === RETRIES) break;

      const delay = attempt * 1500;
      console.warn(`Retrying ${label} after failure (${attempt}/${RETRIES})...`);
      await sleep(delay);
    }
  }

  throw lastError;
}

async function readLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");

  try {
    const raw = await readFile(envPath, "utf8");
    return Object.fromEntries(
      raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
          const [key, ...valueParts] = line.split("=");
          return [key, valueParts.join("=").replace(/^["']|["']$/g, "")];
        }),
    );
  } catch {
    return {};
  }
}

type ImageFile = {
  absolutePath: string;
  relativePath: string;
  filename: string;
  folder: string;
  title: string;
};

function titleFromFilename(filename: string) {
  return path
    .basename(filename, path.extname(filename))
    .normalize("NFC")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function inferType(title: string) {
  const normalized = title.toLowerCase();
  const typeKeywords: Array<[RegExp, string]> = [
    [/\b(coffee table)\b/, "Coffee Table"],
    [/\b(side table|side tables)\b/, "Side Table"],
    [/\b(center table|centre table)\b/, "Center Table"],
    [/\b(console table|console)\b/, "Console"],
    [/\b(gateleg table)\b/, "Gateleg Table"],
    [/\b(table lamp|table lamps)\b/, "Table Lamp"],
    [/\b(table|tables)\b/, "Table"],
    [/\b(fauteuil|fauteuils)\b/, "Fauteuil"],
    [/\b(armchair|armchairs)\b/, "Armchair"],
    [/\b(chair|chairs)\b/, "Chair"],
    [/\b(stool|stools)\b/, "Stool"],
    [/\b(bench|benches)\b/, "Bench"],
    [/\b(day bed|bed)\b/, "Bed"],
    [/\b(canape|sofa)\b/, "Sofa"],
    [/\b(chandelier|chandeliers)\b/, "Chandelier"],
    [/\b(ceiling fixture)\b/, "Ceiling Fixture"],
    [/\b(wall light|wall lights)\b/, "Wall Light"],
    [/\b(floor lamp|floorlamp)\b/, "Floor Lamp"],
    [/\b(lamp|lamps)\b/, "Lamp"],
    [/\b(candlestick|candlesticks)\b/, "Candlestick"],
    [/\b(candelabra)\b/, "Candelabra"],
    [/\b(chenets|fire set|firescreen|fireplace)\b/, "Fireplace Accessory"],
    [/\b(mirror|mirrors)\b/, "Mirror"],
    [/\b(commode)\b/, "Commode"],
    [/\b(armoire)\b/, "Armoire"],
    [/\b(cabinet)\b/, "Cabinet"],
    [/\b(secretaire|bureau plat|desk)\b/, "Desk"],
    [/\b(screen)\b/, "Screen"],
    [/\b(rug)\b/, "Rug"],
    [/\b(vase|vases|albarelo)\b/, "Vase"],
    [/\b(orb)\b/, "Glass Object"],
    [/\b(sculpture|sculptures)\b/, "Sculpture"],
    [/\b(medallions|composition|painting|sin titulo|cabeza)\b/, "Artwork"],
    [/\b(magazine rack|magazine racks)\b/, "Magazine Rack"],
    [/\b(grille|grilles|transom)\b/, "Architectural Element"],
    [/\b(box)\b/, "Box"],
    [/\b(trophy)\b/, "Trophy"],
    [/\b(column|columns|tazze|brackets|porte torcheres)\b/, "Decorative Object"],
  ];

  return typeKeywords.find(([pattern]) => pattern.test(normalized))?.[1] ?? "Object";
}

function shortHash(value: string) {
  return createHash("sha1").update(value).digest("hex").slice(0, 12);
}

async function collectImages(dir: string): Promise<ImageFile[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const images = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectImages(absolutePath);
      if (!entry.isFile()) return [];

      const ext = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) return [];

      const relativePath = path.relative(IMAGE_ROOT, absolutePath);
      const folder = path.dirname(relativePath).replaceAll(path.sep, " / ");
      return [
        {
          absolutePath,
          relativePath,
          filename: entry.name,
          folder: folder === "." ? "Imported Images" : folder,
          title: titleFromFilename(entry.name),
        },
      ];
    }),
  );

  return images.flat().sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

async function main() {
  const env = await readLocalEnv();
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
    env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ??
    env.NEXT_PUBLIC_SANITY_API_VERSION ??
    "2025-02-19";

  if (!projectId || !dataset) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.");
  }

  const client = getCliClient({ projectId, dataset, apiVersion });
  const files = await collectImages(IMAGE_ROOT);
  const slugCounts = new Map<string, number>();

  console.log(`Found ${files.length} images in ${IMAGE_ROOT}`);

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const id = `selectionItem-import-${shortHash(file.relativePath)}`;
    const existing = await client.fetch<{ _id: string } | null>(
      "*[_id == $id][0]{_id}",
      { id },
    );

    if (existing) {
      skipped += 1;
      console.log(`SKIP ${file.relativePath}`);
      continue;
    }

    const asset = await withRetries(
      `upload ${file.relativePath}`,
      async () =>
        client.assets.upload("image", createReadStream(file.absolutePath), {
          filename: file.filename,
      title: file.title,
        }),
    );

    const baseSlug = slugify(file.title) || `selection-item-${shortHash(file.relativePath)}`;
    const slugCount = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, slugCount + 1);
    const slug =
      slugCount === 0 ? baseSlug : `${baseSlug}-${slugify(file.folder) || slugCount + 1}`;

    await withRetries(`create ${file.relativePath}`, async () =>
      client.createOrReplace({
        _id: id,
        _type: "selectionItem",
        title: file.title,
        slug: {
          _type: "slug",
          current: slug,
        },
      description: STUB_DESCRIPTION,
      type: inferType(file.title),
      facts: [
          {
            _key: "source",
            _type: "factItem",
            label: "Source",
            value: file.folder,
          },
        ],
        image: {
          _type: "imageItem",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
          alt: file.title,
        },
      }),
    );

    created += 1;
    console.log(`CREATE ${file.relativePath}`);
  }

  console.log(`Done. Created ${created}; skipped ${skipped}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
