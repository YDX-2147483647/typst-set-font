import { resolve_FontSet } from "./resolve.ts";
import {
  FallbackRule,
  FontSet,
  FontSetAdvanced,
  FontSetResolved,
  TYPST_FONT,
} from "./types.ts";

// TODO: Support emph and strong.
// TODO: Support FontSetPersonal.

/**
 * Calculate if advanced features are permitted or enabled.
 *
 * Some features require a font to be set explicitly.
 * Therefore, the result of `calc_advanced(font)` and `calc_advanced(resolve_FontSet(font))` may differ.
 *
 * @param font
 * @returns Only advanced features will be returned. For each feature, `null` = not permitted, `boolean` = enabled or not.
 */
export function calc_advanced(font: FontSetAdvanced): FontSetResolved &
  Omit<Required<FontSetAdvanced>, keyof FontSet | "emph" | "strong"> &
  (
    | { smartquote_for_latin: null; text: FontSetResolved["text"] }
    | {
        smartquote_for_latin: boolean;
        text: NonNullable<FontSetResolved["text"]>;
      }
  ) {
  const resolved = resolve_FontSet(font);

  if (resolved.text === null) {
    return {
      ...resolved,
      smartquote_for_latin: null,
      list_marker_prefer_default: null,
    };
  } else {
    return {
      ...resolved,
      text: resolved.text, // This redundant line helps typescript infer types

      smartquote_for_latin:
        font.text.han && resolved.text.rule === FallbackRule.HanFirst
          ? (font.smartquote_for_latin ?? false)
          : null,

      list_marker_prefer_default:
        resolved.text.latin !== TYPST_FONT.text
          ? (font.list_marker_prefer_default ?? false)
          : null,
    };
  }
}

/**
 * Stringify `FontSetAdvanced` as typst code in code (not markup) mode.
 */
export function stringify_advanced(
  font: ReturnType<typeof calc_advanced>,
): string[] {
  return [
    font.smartquote_for_latin
      ? font.text.latin === font.text.han
        ? `show smartquote: set text(features: ("pwid",))`
        : `show smartquote: set text(font: "${font.text.latin}")`
      : null,

    font.list_marker_prefer_default
      ? `set list(marker: ([•], [‣], [–]).map(text.with(font: "${TYPST_FONT.text}")))`
      : null,
  ].filter((rule) => rule !== null);
}
