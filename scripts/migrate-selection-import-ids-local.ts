import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";

type ImportedSelectionItem = {
  _id: string;
  _type: "selectionItem";
  title?: string;
  slug?: {
    _type: "slug";
    current?: string;
  };
  description?: string;
  type?: string;
  facts?: Array<{
    _key?: string;
    _type?: "factItem";
    label?: string;
    value?: string;
  }>;
  image?: {
    _type: "imageItem";
    asset?: {
      _type: "reference";
      _ref: string;
    };
    alt?: string;
  };
};

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

function publicIdFor(privateId: string) {
  return privateId.replace(/^selectionItem\.import\./, "selectionItem-import-");
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
  const items = await client.fetch<ImportedSelectionItem[]>(
    '*[_type == "selectionItem" && _id in path("selectionItem.import.*")]',
  );

  for (const item of items) {
    const publicId = publicIdFor(item._id);
    await client.createOrReplace(
      {
        _id: publicId,
        _type: "selectionItem",
        title: item.title,
        slug: item.slug,
        description: item.description,
        type: item.type,
        facts: item.facts,
        image: item.image,
      },
      { visibility: "sync" },
    );
    console.log(`CREATE ${publicId}`);
  }

  console.log(`Done. Created ${items.length} public selection items.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
