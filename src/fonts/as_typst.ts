/**
 * @module
 * Generate typst codes for resolved fonts.
 */

import {
  FallbackRule,
  FontSetAdvanced,
  FontSetResolved,
  TYPST_FONT,
  type FontFamilies,
  type FontName,
  type MathFontFamilies,
  type Resolved,
} from "./types.ts";

class TypstCode {
  readonly repr: string;
  constructor(repr: string) {
    this.repr = repr;
  }
}
const typst_code = (repr: string) => new TypstCode(repr);

const FallbackRule_fn = new Map<
  FallbackRule,
  (font: {
    han: FontName;
    latin: FontName;
  }) => (string | { name: string; covers: TypstCode | string })[]
>([
  [
    FallbackRule.HanFirst,
    ({ han, latin }) => [{ name: latin, covers: "latin-in-cjk" }, han],
  ],
  [FallbackRule.LatinFirst, ({ han, latin }) => [latin, han]],
  [
    FallbackRule.HanOnlyIdeographs,
    ({ han, latin }) => [
      { name: han, covers: typst_code(`regex("\\p{Han}")`) },
      latin,
    ],
  ],
]);

export function stringify_FontFamilies(font: Resolved<FontFamilies>): string {
  const font_list =
    font.latin === font.han
      ? [font.latin]
      : FallbackRule_fn.get(font.rule)!(font);

  if ("math" in font) {
    const math = (font as Resolved<MathFontFamilies>).math;
    // Ignore if duplicated
    if (math !== font_list[font_list.length - 1]) {
      font_list.push(math);
    }
  }

  return stringify_TypstCode(font_list);
}

export function stringify_FontSet(
  font: FontSetResolved | (FontSetResolved & FontSetAdvanced),
  { mode }: { mode: "markup" | "code" },
): string {
  // TODO: Support `FontSetAdvanced` and `FontSetPersonal`.

  return [
    font.text ? `set text(font: ${stringify_FontFamilies(font.text)})` : null,
    font.math
      ? `show math.equation: set text(font: ${stringify_FontFamilies(font.math)})`
      : null,
    font.code
      ? `show raw: set text(font: ${stringify_FontFamilies(font.code)})`
      : null,
    "list_marker_prefer_default" in font &&
    font.list_marker_prefer_default &&
    font.text?.latin !== TYPST_FONT.text
      ? `set list(marker: ([•], [‣], [–]).map(text.with(font: "${TYPST_FONT.text}")))`
      : null,
  ]
    .filter(Boolean)
    .map((row) => (mode === "markup" ? `#${row}` : row))
    .join("\n");
}

function stringify_TypstCode(
  repr: (string | Record<string, TypstCode | string>)[],
): string {
  const quote = (x: string): string => `"${x.replaceAll('"', '\\"')}"`;

  const items = repr.map((item) => {
    if (typeof item === "string") {
      return quote(item);
    } else {
      const entries = Object.entries(item).map(([key, value]) => {
        return `${key}: ${typeof value === "string" ? quote(value) : value.repr}`;
      });
      return `(${entries.join(", ")})`;
    }
  });
  return items.length === 1 ? items[0] : `(${items.join(", ")})`;
}
