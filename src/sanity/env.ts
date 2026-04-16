export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-02-19";

export const studioProjectId = projectId || "missing-project-id";
export const studioDataset = dataset || "production";
export const sanityEnvIsConfigured = Boolean(projectId && dataset);
