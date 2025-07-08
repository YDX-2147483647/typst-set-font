/**
 * A case-insensitive font family like _Arial_, without specifying its coverage.
 * https://docs.rs/typst-library/latest/typst_library/text/struct.FontFamily.html
 */
export type FontName = string;

/**
 * A collection of font families used for shaping a text.
 *
 * Roughly a single `#set text(font: …))` in typst,
 * or a mapping from [Unicode _Script_ (long) property](https://www.unicode.org/reports/tr24/#Script_Values_Table)
 * to `FontName`.
 */
export interface FontFamilies {
  /** Latin alphabet */
  latin: FontName;
  /** Han characters */
  han: FontName;
}
export interface MathFontFamilies extends FontFamilies {
  /** A font with OpenType math features */
  math: FontName;
}

/** Create a `FontFamilies` from a single `font`. */
export function FontFamilies_from(font: string): FontFamilies {
  return { latin: font, han: font };
}
/** The default `FontFamilies` in typst. */
export function FontFamilies_default(): FontFamilies {
  // https://docs.rs/crate/typst-library/0.13.1/source/src/text/mod.rs#166
  return FontFamilies_from("Libertinus Serif");
}
/** The default `MathFontFamilies` in typst. */
export function MathFontFamilies_default(): MathFontFamilies {
  // https://docs.rs/typst-library/0.13.1/src/typst_library/math/equation.rs.html#198
  const font = "New Computer Modern Math";
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

/** The default `FontSet` in typst. */
export function FontSet_default(): FontSet {
  return {
    text: FontFamilies_default(),
    math: MathFontFamilies_default(),
    // https://docs.rs/typst-library/0.13.1/src/typst_library/text/raw.rs.html#479
    code: FontFamilies_from("DejaVu Sans Mono"),
  };
}

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
