import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root — there is a stray lockfile in the parent
  // ~/Projects/ directory that Next would otherwise infer as the root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Stub host for placeholder photography. Replace with your CMS / CDN host
    // when wiring up real content.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
