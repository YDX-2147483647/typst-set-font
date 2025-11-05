/**
 * @module
 *
 * Resolve `FontFamilies` into `Resolved<FontFamilies>` as in typst.
 */

import { TYPST_FONT } from "./const.ts";
import {
  FontFamilies,
  FontSet,
  FontSetResolved,
  MathFontFamilies,
  type Resolved,
} from "./types.ts";

/**
 * Resolve `FontFamilies` as in typst.
 *
 * @param font
 * @param category Category of the environment, used to determine fallbacks.
 * @returns Resolved `FontFamilies`, or `null` if no font is set.
 */
export function resolve_FontFamilies(
  font: FontFamilies,
  category: keyof Omit<FontSet, "math">,
): Resolved<FontFamilies> | null {
  const { latin, han, rule } = font;
  const resolved_han = han || latin;

  // If either `latin` or `han` is set
  if (resolved_han) {
    return {
      latin: latin || TYPST_FONT[category],
      han: resolved_han,
      rule,
    } satisfies Resolved<FontFamilies>;
  } else {
    return null;
  }
}

/**
 * Resolve `MathFontFamilies` as in typst.
 *
 * @param font
 * @returns Resolved `MathFontFamilies`, or `null` if no font is set.
 */
export function resolve_MathFontFamilies(
  font: MathFontFamilies,
): Resolved<MathFontFamilies> | null {
  const { latin, han, math, rule } = font;
  if (latin || han || math) {
    const resolved_math = math || TYPST_FONT.math;
    const resolved_latin = latin || resolved_math;

    return {
      latin: resolved_latin,
      han: han || resolved_latin,
      math: resolved_math,
      rule,
    } satisfies Resolved<MathFontFamilies>;
  } else {
    return null;
  }
}

/**
 * Resolve `FontSet` as in typst.
 *
 * If a category’s font is not set, then it will be replaced with `null`.
 */
export function resolve_FontSet<T extends FontSet>(
  font: T,
): FontSetResolved & Omit<T, keyof FontSet> {
  const { text, math, code, ...others } = font;
  return {
    text: resolve_FontFamilies(text, "text"),
    math: resolve_MathFontFamilies(math),
    code: resolve_FontFamilies(code, "code"),
    ...others,
  };
}
