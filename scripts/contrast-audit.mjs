#!/usr/bin/env node
/**
 * Contrast audit for the shared theme system.
 * Parses base.css + client globals.css, mimics the CSS cascade per theme,
 * and computes WCAG contrast ratios for the token pairs that matter.
 */
import { readFileSync } from "node:fs";

// ── Color parsing ──────────────────────────────────────────────

function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length === 8) h = h.slice(0, 6); // ignore alpha for now
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
}

// oklch -> oklab -> lms -> linear srgb
function oklchToRgb(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  // gamma-encode linear sRGB so downstream treats all colors uniformly
  const gam = (c) => {
    c = Math.min(1, Math.max(0, c));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  };
  return [gam(r), gam(g), gam(bl)];
}

/** parse a CSS color literal -> {rgb:[r,g,b] linear 0-1 (srgb gamma-encoded actually), alpha} or null */
function parseColor(value) {
  value = value.trim();
  const hexMatch = value.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let alpha = 1;
    const h = hexMatch[1];
    if (h.length === 8) alpha = parseInt(h.slice(6, 8), 16) / 255;
    return { rgb: hexToRgb(value), alpha };
  }
  const ok = value.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)(%?)\s*)?\)$/);
  if (ok) {
    let L = parseFloat(ok[1]);
    if (ok[2] === "%") L /= 100;
    const C = parseFloat(ok[3]);
    const H = parseFloat(ok[4]);
    let alpha = 1;
    if (ok[5] !== undefined) {
      alpha = parseFloat(ok[5]);
      if (ok[6] === "%") alpha /= 100;
    }
    return { rgb: oklchToRgb(L, C, H), alpha };
  }
  const rgba = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) {
    const parts = rgba[1].split(/[,\s/]+/).filter(Boolean).map(parseFloat);
    return { rgb: [parts[0] / 255, parts[1] / 255, parts[2] / 255], alpha: parts[3] ?? 1 };
  }
  return null;
}

/** composite a possibly-translucent fg over an opaque bg (both gamma srgb 0-1) */
function composite(fg, bg) {
  if (fg.alpha >= 1) return fg.rgb;
  return fg.rgb.map((c, i) => c * fg.alpha + bg[i] * (1 - fg.alpha));
}

function relLuminance(rgb) {
  const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrast(fgColor, bgColor) {
  const bg = bgColor.rgb; // assume opaque bg
  const fg = composite(fgColor, bg);
  const L1 = relLuminance(fg), L2 = relLuminance(bg);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

// ── CSS parsing (flat custom-property blocks only) ─────────────

/** returns ordered list of {selector, props: {name: value}} */
function parseBlocks(css) {
  // strip comments and @import lines (they glue onto the next selector otherwise)
  css = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@import[^;]+;/g, "");
  const blocks = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const selector = m[1].trim();
    const body = m[2];
    const props = {};
    for (const decl of body.split(";")) {
      const idx = decl.indexOf(":");
      if (idx === -1) continue;
      const name = decl.slice(0, idx).trim();
      const value = decl.slice(idx + 1).trim();
      if (name.startsWith("--")) props[name] = value;
    }
    if (Object.keys(props).length) blocks.push({ selector, props });
  }
  return blocks;
}

const THEMES = ["twilight", "light", "muted", "tropical", "oceanic", "punk", "ember", "arctic", "forest", "mono", "regal"];

/** Build effective token map for a theme following cascade source order.
 *  files: ordered array of css strings (base.css first, then client). */
function tokensForTheme(files, theme) {
  const tokens = {};
  for (const css of files) {
    for (const block of parseBlocks(css)) {
      const sel = block.selector;
      const applies =
        /(^|,\s*):root$/.test(sel) || sel.endsWith(":root") ||
        sel.includes(`[data-theme="${theme}"]`);
      if (applies) Object.assign(tokens, block.props);
    }
  }
  return tokens;
}

/** resolve var() references inside token values (1 level deep, iterate) */
function resolveTokens(tokens) {
  const out = { ...tokens };
  for (let pass = 0; pass < 4; pass++) {
    for (const [k, v] of Object.entries(out)) {
      out[k] = v.replace(/var\((--[\w-]+)(?:,\s*([^)]*))?\)/g, (_, name, fallback) =>
        out[name] !== undefined ? out[name] : (fallback ?? ""));
    }
  }
  return out;
}

// ── Audit definitions ──────────────────────────────────────────

const args = process.argv.slice(2);
const clientFile = args[0]; // optional client globals path
const files = [readFileSync("/home/rodrigo/development/components-library/src/styles/base.css", "utf8")];
let clientName = "library-only";
if (clientFile) {
  files.push(readFileSync(clientFile, "utf8"));
  clientName = clientFile.split("/").slice(-4)[0];
}

// pairs: [fgToken, bgToken, minRatio, context]
const TEXT_ON_SURFACES = [
  ["--text-primary", "--background-base", 7, "body text"],
  ["--text-primary", "--background-surface", 7, "card text"],
  ["--text-primary", "--background-elevated", 6, "elevated text"],
  ["--text-secondary", "--background-surface", 4.5, "secondary text"],
  ["--text-tertiary", "--background-surface", 3.0, "tertiary text"],
  ["--text-muted", "--background-surface", 2.8, "muted text"],
  ["--accent-primary", "--background-surface", 4.5, "links/accent text"],
  ["--calculated-accent-primary-contrast", "--accent-primary", 4.5, "button label"],
  ["--calculated-text-inverse", "--accent-primary", 4.5, "inverse text on accent"],
  ["--color-danger", "--background-surface", 4.0, "danger text"],
  ["--color-success", "--background-surface", 4.0, "success text"],
  ["--color-warning", "--background-surface", 4.0, "warning text"],
  ["--color-info", "--background-surface", 4.0, "info text"],
  ["--calculated-select-option-text", "--calculated-select-option-background-color", 4.5, "select option"],
];

// client-specific palette tokens audited as text on surface
const CLIENT_TEXT_TOKENS = [
  /^--status-/, /^--log-/, /^--node-/, /^--component-category-/,
  /^--provider-/, /^--color-(?!white)/,
];

let totalFail = 0;
for (const theme of THEMES) {
  const tokens = resolveTokens(tokensForTheme(files, theme));
  const rows = [];
  const get = (name) => (tokens[name] ? parseColor(tokens[name]) : null);

  for (const [fg, bg, min, ctx] of TEXT_ON_SURFACES) {
    const f = get(fg), b = get(bg);
    if (!f || !b) continue;
    const r = contrast(f, b);
    if (r < min) rows.push(`  FAIL ${r.toFixed(2).padStart(5)} < ${min}  ${ctx}: ${fg} on ${bg}  (${tokens[fg]} on ${tokens[bg]})`);
  }
  if (clientFile) {
    const surface = get("--background-surface");
    if (surface) {
      for (const name of Object.keys(tokens)) {
        if (!CLIENT_TEXT_TOKENS.some((re) => re.test(name.slice(2 - 2 + 2)))) continue; // match without --
      }
      for (const name of Object.keys(tokens)) {
        const bare = name.slice(2);
        if (!CLIENT_TEXT_TOKENS.some((re) => re.test("--" + bare))) continue;
        if (name.includes("subtle") || name.includes("glow") || name.includes("gradient") || name.includes("conic") || name.includes("colors") || name.includes("speed")) continue;
        const f = get(name);
        if (!f) continue;
        const r = contrast(f, surface);
        if (r < 3.4) rows.push(`  fail ${r.toFixed(2).padStart(5)} < 3.4  client token as text: ${name}  (${tokens[name]})`);
      }
    }
  }
  if (rows.length) {
    console.log(`\n■ ${theme} [${clientName}]`);
    rows.sort().forEach((r) => console.log(r));
    totalFail += rows.length;
  }
}
console.log(`\n${clientName}: ${totalFail} failing pairs`);
