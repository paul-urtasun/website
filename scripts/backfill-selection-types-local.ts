import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";

type SelectionItem = {
  _id: string;
  title?: string;
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
  const items = await client.fetch<SelectionItem[]>(
    '*[_type == "selectionItem" && (!defined(type) || type == "")]{_id,title}',
  );

  for (const item of items) {
    const type = inferType(item.title ?? "");
    await client.patch(item._id).set({ type }).commit();
    console.log(`SET ${item._id}: ${type}`);
  }

  console.log(`Done. Backfilled ${items.length} selection item types.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
