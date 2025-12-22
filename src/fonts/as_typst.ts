/**
 * @module
 * Generate typst codes for resolved fonts.
 */

import {
  FallbackRule,
  FontSetAdvanced,
  FontSetResolved,
  type FontFamilies,
  type FontName,
  type MathFontFamilies,
  type NonMathFallbackRule,
  type Resolved,
} from "./types.ts";

class TypstCode {
  readonly repr: string;
  constructor(repr: string) {
    this.repr = repr;
  }
}
const typst_code = (repr: string) => new TypstCode(repr);

type TypstFontList = (string | { name: string; covers: TypstCode | string })[];

/** Non-math font fallback rules when han ≠ latin */
const NonMathFallbackRule_fn: Record<
  NonMathFallbackRule,
  (font: { han: FontName; latin: FontName }) => TypstFontList
> = {
  [FallbackRule.HanFirst]: ({ han, latin }) => [
    { name: latin, covers: "latin-in-cjk" },
    han,
  ],
  [FallbackRule.LatinFirst]: ({ han, latin }) => [latin, han],
  [FallbackRule.HanOnlyIdeographs]: ({ han, latin }) => [
    { name: han, covers: typst_code(`regex("\\p{Han}")`) },
    latin,
  ],
};

export function stringify_FontFamilies(font: Resolved<FontFamilies>): string {
  const font_list =
    font.latin === font.han
      ? [font.latin]
      : NonMathFallbackRule_fn[font.rule](font);

  return stringify_TypstCode(font_list);
}

/** This is an internal function. It is exported only for unit tests. */
export function calculate_MathFontFamilies(
  font: Resolved<MathFontFamilies>,
): TypstFontList {
  /**
   * Punctuation marks shared by Latin and Han.
   *
   * Latin-1 Supplement:
   *   00B7 MIDDLE DOT, excluded because of $dot.c$
   * General Punctuation:
   *   2013 EN DASH
   *   2014 EM DASH
   *   2018 LEFT SINGLE QUOTATION MARK
   *   2019 RIGHT SINGLE QUOTATION MARK
   *   201C LEFT DOUBLE QUOTATION MARK
   *   201D RIGHT DOUBLE QUOTATION MARK
   *   2025 TWO DOT LEADER
   *   2026 HORIZONTAL ELLIPSIS, excluded because of $...$
   *   2027 HYPHENATION POINT
   * Supplemental Punctuation:
   *   2E3A TWO-EM DASH
   */
  const shared = "–—‘’“”‥‧⸺";

  const { math, han, latin } = font;
  if (math === latin) {
    if (math === han) {
      // Case 1.1: math = latin = han
      return [math];
    } else {
      // Case 1.2: math = latin ≠ han
      if (font.rule === FallbackRule.HanFirst) {
        return [
          { name: han, covers: typst_code(`regex("[${shared}]")`) },
          math,
          han,
        ];
      } else {
        return [math, han];
      }
    }
  } else {
    const regex_latin = typst_code(`regex("[.\\d\\p{Latin}]")`);
    const regex_shared = typst_code(`regex("[${shared}]")`);
    const regex_latin_and_shared = typst_code(
      `regex("[.\\d\\p{Latin}${shared}]")`,
    );

    if (math === han) {
      // Case 2.0: math = han ≠ latin
      // Such font does not exist as of 2025, but we have to generate something
      if ([FallbackRule.HanFirst, FallbackRule.MathFirst].includes(font.rule)) {
        return [math, latin];
      } else if (font.rule === FallbackRule.LatinFirst) {
        return [{ name: latin, covers: regex_latin_and_shared }, math, latin];
      } else {
        return [{ name: latin, covers: regex_latin }, math, latin];
      }
    } else if (latin === han) {
      // Case 2.1: math ≠ latin = han
      if (
        [FallbackRule.LatinFirst, FallbackRule.HanFirst].includes(font.rule)
      ) {
        return [{ name: han, covers: regex_latin_and_shared }, math, han];
      } else {
        return [math, han];
      }
    } else {
      // Case 2.2: math ≠ latin ≠ han ≠ math
      const rule: Record<FallbackRule, TypstFontList> = {
        [FallbackRule.MathFirst]: [
          { name: latin, covers: regex_latin },
          math,
          han,
        ],
        [FallbackRule.HanFirst]: [
          { name: latin, covers: regex_latin },
          { name: han, covers: regex_shared },
          math,
          han,
        ],
        [FallbackRule.LatinFirst]: [
          { name: latin, covers: regex_latin_and_shared },
          math,
          han,
        ],
        [FallbackRule.HanOnlyIdeographs]: [
          { name: latin, covers: regex_latin },
          { name: han, covers: typst_code(`regex("\\p{Han}")`) },
          math,
        ],
      };
      return rule[font.rule];
    }
  }
}

export function stringify_MathFontFamilies(
  font: Resolved<MathFontFamilies>,
): string {
  const font_list = calculate_MathFontFamilies(font);
  return stringify_TypstCode(font_list);
}

export function stringify_FontSet(
  font: FontSetResolved | (FontSetResolved & FontSetAdvanced),
  { mode, postscript = [] }: { mode: "markup" | "code"; postscript?: string[] },
): string {
  return [
    font.text ? `set text(font: ${stringify_FontFamilies(font.text)})` : null,
    font.math
      ? `show math.equation: set text(font: ${stringify_MathFontFamilies(font.math)})`
      : null,
    font.code
      ? `show raw: set text(font: ${stringify_FontFamilies(font.code)})`
      : null,
    ...postscript,
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
