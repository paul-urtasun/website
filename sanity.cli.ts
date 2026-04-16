import { defineCliConfig } from "sanity/cli";
import {
  dataset,
  projectId,
  studioDataset,
  studioProjectId,
} from "./src/sanity/env";

export default defineCliConfig({
  api: {
    projectId: projectId || studioProjectId,
    dataset: dataset || studioDataset,
  },
});
