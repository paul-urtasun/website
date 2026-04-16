import {
  createClient,
  type QueryParams,
  type SanityClient,
} from "next-sanity";
import {
  apiVersion,
  dataset,
  projectId,
  sanityEnvIsConfigured,
} from "@/sanity/env";

export const client: SanityClient | null = sanityEnvIsConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

type SanityFetchOptions<QueryString extends string> = {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
};

export async function sanityFetch<
  Result,
  const QueryString extends string = string,
>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchOptions<QueryString>): Promise<Result | null> {
  if (!client) return null;

  try {
    return await client.fetch<Result>(query, params, {
      next: {
        revalidate: tags.length ? false : revalidate,
        tags,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Sanity fetch failed; falling back to stub content.", error);
    }
    return null;
  }
}
