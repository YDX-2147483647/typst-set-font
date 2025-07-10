/**
 * A case-insensitive font family like _Arial_, without specifying its coverage.
 * https://docs.rs/typst-library/latest/typst_library/text/struct.FontFamily.html
 */
export type FontName = string;

/**
 * The rule for font fallback.
 *
 * Some punctuations share the same codepoints for Latin and Han.
 * When choosing the font for these shared punctuations, different rules may vary.
 */
export enum FallbackRule {
  /**
   * Use the latin font for shared punctuations.
   *
   * Example: `("Arial", "SimSun")` in typst.
   * */
  LatinFirst,
  /**
   * Use the Han font for shared punctuations.
   *
   * Example: `((name: "Arial", covers: "latin-in-cjk"), "SimSun")` in typst.
   */
  HanFirst,
  /**
   * The text mainly consists of Latin paragraphs, interspersed with some Chinese ideograph.
   * Therefore, shared punctuations should be rendered in the Latin font,
   * and the result of other Han punctuations does not matter.
   *
   * Nevertheless, this rule may cause punctuation marks to become tofus,
   * even if they are available in system fonts.
   * https://github.com/typst/typst/issues/6566
   *
   * Example: `((name: "SimSun", covers: regex("\\p{Han}")), "Arial")` in typst.
   * Example: show-set Latin font, and show-regex-set Han font.
   */
  HanOnlyIdeographs,
}
const FallbackRule_default = FallbackRule.HanFirst;

/** Convert from `{ foo?: U | null }` to `{ foo: U }`. */
export type Resolved<T> = { [P in keyof Required<T>]: NonNullable<T[P]> };

/**
 * A collection of font families used for shaping a text.
 *
 * Roughly a single `#set text(font: …))` in typst,
 * or a mapping from [Unicode _Script_ (long) property](https://www.unicode.org/reports/tr24/#Script_Values_Table)
 * to `FontName`.
 */
export interface FontFamilies {
  /** Latin alphabet */
  latin?: FontName | null;
  /** Han characters */
  han?: FontName | null;
  /** Fallback rule, only relevant when the Latin and Han fonts are different and the Han font is set explicitly. */
  rule: FallbackRule;
}
export interface MathFontFamilies extends FontFamilies {
  /** A font with OpenType math features */
  math?: FontName | null;
}

export function FontFamilies_empty(): Required<FontFamilies> {
  return { latin: null, han: null, rule: FallbackRule_default };
}
/** Create a `FontFamilies` from a single `font`. */
export function FontFamilies_from(font: string): Resolved<FontFamilies> {
  return { ...FontFamilies_empty(), latin: font, han: font };
}
export function MathFontFamilies_empty(): Required<MathFontFamilies> {
  return { ...FontFamilies_empty(), math: null };
}
/** Create a `MathFontFamilies` from a single `font`. */
export function MathFontFamilies_from(
  font: string,
): Resolved<MathFontFamilies> {
  return { ...FontFamilies_from(font), math: font };
}

/**
 * A set of `FontFamilies` used for typesetting a document.
 *
 * Represents a mapping from document elements to corresponding `FontFamilies`.
 *
 * A `FontSet` without other extensions is [a minimal setup for typesetting](https://docs.rs/typst-kit/0.13.1/typst_kit/fonts/index.html#embedded-fonts).
 */
export interface FontSet {
  /** [`text` in typst](https://typst.app/docs/reference/text/text/) */
  text: FontFamilies;
  /** [`math.equation` in typst](https://typst.app/docs/reference/math/equation/) */
  math: MathFontFamilies;
  /** [`raw` in typst](https://typst.app/docs/reference/text/raw/) */
  code: FontFamilies;
}
export interface FontSetRequired extends FontSet {
  text: Required<FontFamilies>;
  math: Required<MathFontFamilies>;
  code: Required<FontFamilies>;
}
export interface FontSetResolved {
  text: Resolved<FontFamilies> | null;
  math: Resolved<MathFontFamilies> | null;
  code: Resolved<FontFamilies> | null;
}

export function FontSet_empty(): FontSetRequired {
  return {
    text: FontFamilies_empty(),
    math: MathFontFamilies_empty(),
    // https://docs.rs/typst-library/0.13.1/src/typst_library/text/raw.rs.html#479
    code: FontFamilies_empty(),
  };
}

/** The default fallback fonts in typst. */
export const TYPST_FONT = {
  /** https://docs.rs/crate/typst-library/0.13.1/source/src/text/mod.rs#166 */
  text: "Libertinus Serif",
  /** https://docs.rs/typst-library/0.13.1/src/typst_library/math/equation.rs.html#198 */
  math: "New Computer Modern Math",
  /** https://docs.rs/typst-library/0.13.1/src/typst_library/text/raw.rs.html#479 */
  code: "DejaVu Sans Mono",
};

/** [The cuti typst package](https://typst.app/universe/package/cuti) simulating (fake) bold, italic, etc. */
export type CUTI = "@preview/cuti:0.3.0";

/**
 * An advanced `FontSet` fixing basic issues of document elements.
 */
export interface FontSetAdvanced extends FontSet {
  /** [`emph` in typst](https://typst.app/docs/reference/model/emph/) */
  emph?: FontFamilies | CUTI;
  /** [`strong` in typst](https://typst.app/docs/reference/model/strong/) */
  strong?: FontFamilies | CUTI;
  /** Whether to revert to the default font for [`list.marker` in typst](https://typst.app/docs/reference/model/list/#parameters-marker) */
  list_marker_prefer_default?: boolean;
  /** Whether [`smartquote` in typst](https://typst.app/docs/reference/text/smartquote/) is used exclusively for Latin */
  smartquote_for_latin?: boolean;
}

/**
 * An extended `FontSet` for customizing document elements based on personal preferences.
 */
export interface FontSetPersonal extends FontSet {
  /** [`heading` in typst](https://typst.app/docs/reference/model/heading/) */
  heading?: FontFamilies;
}
