import type { CSSProperties } from "react";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { sanityEnvIsConfigured } from "@/sanity/env";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

const studioShellStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background: "#fff",
} satisfies CSSProperties;

const noticeStyle = {
  minHeight: "100dvh",
  display: "grid",
  placeItems: "center",
  padding: 24,
  background: "#fff",
  color: "#1a1a1a",
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} satisfies CSSProperties;

const noticeInnerStyle = {
  maxWidth: 520,
  lineHeight: 1.55,
} satisfies CSSProperties;

const codeStyle = {
  display: "block",
  marginTop: 16,
  padding: 16,
  background: "#f4f2ed",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 13,
  whiteSpace: "pre-wrap",
} satisfies CSSProperties;

export default function StudioPage() {
  if (!sanityEnvIsConfigured) {
    return (
      <div style={studioShellStyle}>
        <div style={noticeStyle}>
          <div style={noticeInnerStyle}>
            <h1>Sanity Studio is not configured</h1>
            <p>
              Add Sanity project settings to your environment, then restart the
              dev server.
            </p>
            <code style={codeStyle}>
              NEXT_PUBLIC_SANITY_PROJECT_ID=...
              {"\n"}NEXT_PUBLIC_SANITY_DATASET=production
              {"\n"}NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={studioShellStyle}>
      <NextStudio config={config} />
    </div>
  );
}
