import {
  createImageUrlBuilder,
  type ImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import {
  dataset,
  projectId,
  sanityEnvIsConfigured,
} from "@/sanity/env";

const builder: ImageUrlBuilder | null = sanityEnvIsConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export function urlFor(source: SanityImageSource) {
  return builder?.image(source) ?? null;
}
