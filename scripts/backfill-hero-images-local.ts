import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";

type ImageRef = {
  _type: string;
  _key?: string;
  asset?: { _ref: string; _type: string };
  hotspot?: object;
  crop?: object;
  alt?: string;
};

type InteriorProject = {
  _id: string;
  title?: string;
  heroImage?: ImageRef;
  images?: ImageRef[];
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
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.",
    );
  }

  const client = getCliClient({ projectId, dataset, apiVersion });

  const projects = await client.fetch<InteriorProject[]>(
    `*[_type == "interiorProject" && defined(images[0])] { _id, title, heroImage, images[0] }`,
  );

  let patched = 0;

  for (const project of projects) {
    if (project.heroImage?.asset?._ref) {
      console.log(`SKIP ${project.title} — hero image already set`);
      continue;
    }

    const firstImage = project.images?.[0];
    if (!firstImage) {
      console.log(`SKIP ${project.title} — no images`);
      continue;
    }

    // Strip _key (array items carry one; the standalone field must not)
    const { _key: _, ...heroImage } = firstImage as ImageRef & { _key?: string };

    await client.patch(project._id).set({ heroImage }).commit();
    console.log(`SET  ${project.title}`);
    patched++;
  }

  console.log(`\nDone. Patched ${patched} of ${projects.length} projects.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
