import sharp from "sharp";

/** Matches `var(--rule)` when sampling fails; still normalized to target luminosity. */
const FALLBACK_HEX = "#e6e2d8";

/** HSL lightness (0–100), per design spec for gallery backdrops. */
const TARGET_LUMINOSITY = 94;

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

function rgbWithLuminosity(
  r: number,
  g: number,
  b: number,
  luminosity: number,
) {
  const { h, s } = rgbToHsl(r, g, b);
  return hslToRgb(h, s, luminosity);
}

function rgbToCss({ r, g, b }: { r: number; g: number; b: number }) {
  return `rgb(${r} ${g} ${b})`;
}

function fallbackCss() {
  const { r, g, b } = hexToRgb(FALLBACK_HEX);
  return rgbToCss(rgbWithLuminosity(r, g, b, TARGET_LUMINOSITY));
}

/**
 * Downsamples the image, averages RGB, then fixes HSL luminosity to {@link TARGET_LUMINOSITY}.
 */
export async function dominantColorFromImageUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return fallbackCss();
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const { data, info } = await sharp(buf)
      .resize(48, 48, { fit: "cover" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    if (channels < 1 || data.length === 0) {
      return fallbackCss();
    }

    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += channels) {
      r += data[i] ?? 0;
      if (channels >= 3) {
        g += data[i + 1] ?? 0;
        b += data[i + 2] ?? 0;
      } else {
        g += data[i] ?? 0;
        b += data[i] ?? 0;
      }
      count++;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    return rgbToCss(rgbWithLuminosity(r, g, b, TARGET_LUMINOSITY));
  } catch {
    return fallbackCss();
  }
}
