/**
 * @module
 *
 * Resolve `FontFamilies` into `Resolved<FontFamilies>` as in typst.
 */

import {
  FontFamilies,
  FontSet,
  FontSetResolved,
  MathFontFamilies,
  TYPST_FONT,
  type Resolved,
} from "./types.ts";

/**
 * Resolve `FontFamilies` as in typst.
 *
 * @param font
 * @param category Category of the environment, used to determine fallbacks. If `font.math` exists, then `category` should be and is assumed to be `"math"`.
 * @returns Resolved `FontFamilies`, or `null` if no font is set.
 */
export function resolve_FontFamilies(
  font: MathFontFamilies,
  category: keyof FontSet,
): Resolved<MathFontFamilies> | null;

export function resolve_FontFamilies(
  font: FontFamilies,
  category: "math",
): Resolved<MathFontFamilies> | null;

export function resolve_FontFamilies(
  font: FontFamilies,
  category: keyof FontSet,
): Resolved<FontFamilies> | null {
  const { latin, han, rule } = font;
  const is_math = ("math" in font && font.math) || category === "math";

  if (!is_math) {
    if (latin || han) {
      const resolved_latin = latin || TYPST_FONT[category];

      return {
        latin: resolved_latin,
        han: han || latin,
        rule,
      } as Resolved<FontFamilies>;
    } else {
      return null;
    }
  } else {
    const math = (font as MathFontFamilies).math;
    if (latin || han || math) {
      const resolved_latin =
        latin || math || TYPST_FONT.math.replace(/ Math$/, "");

      return {
        latin: resolved_latin,
        han: han || resolved_latin,
        math: math || TYPST_FONT.math,
        rule,
      } as Resolved<MathFontFamilies>;
    } else {
      return null;
    }
  }
}

/**
 * Resolve `FontSet` as in typst.
 *
 * If a category’s font is not set, then it will be replaced with `null`.
 */
export function resolve_FontSet(font: FontSet): FontSetResolved {
  return {
    text: resolve_FontFamilies(font.text, "text"),
    math: resolve_FontFamilies(font.math, "math"),
    code: resolve_FontFamilies(font.code, "code"),
  };
}
