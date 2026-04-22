/** HSL lightness (0–100), per design spec for gallery backdrops. */
const TARGET_LUMINOSITY = 96;

export type SanityPaletteSwatch = {
  background?: string | null;
  foreground?: string | null;
};

export type SanityPalette = {
  dominant?: SanityPaletteSwatch | null;
  lightMuted?: SanityPaletteSwatch | null;
  muted?: SanityPaletteSwatch | null;
  lightVibrant?: SanityPaletteSwatch | null;
  vibrant?: SanityPaletteSwatch | null;
};

function hexToRgb(hex: string) {
  const n = hex.replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function rgbToHsl(r255: number, g255: number, b255: number) {
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbWithLuminosity(r: number, g: number, b: number, luminosity: number) {
  const { h, s } = rgbToHsl(r, g, b);
  return hslToRgb(h, s, luminosity);
}

function rgbToCss({ r, g, b }: { r: number; g: number; b: number }) {
  return `rgb(${r} ${g} ${b})`;
}

function normalizedHex(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed : null;
}

function paletteBackground(palette: SanityPalette | null | undefined) {
  return (
    normalizedHex(palette?.lightMuted?.background) ??
    normalizedHex(palette?.dominant?.background) ??
    normalizedHex(palette?.muted?.background) ??
    normalizedHex(palette?.lightVibrant?.background) ??
    normalizedHex(palette?.vibrant?.background)
  );
}

/**
 * Uses Sanity asset palette metadata, then normalizes lightness for the site backdrop treatment.
 */
export function backdropColorFromPalette(
  palette: SanityPalette | null | undefined,
  luminosity: number = TARGET_LUMINOSITY,
): string | undefined {
  const hex = paletteBackground(palette);
  if (!hex) return undefined;

  const { r, g, b } = hexToRgb(hex);
  return rgbToCss(rgbWithLuminosity(r, g, b, luminosity));
}
