/**
 * A file without complex types, to be compatible with `node --experimental-strip-types`.
 * @module
 */

/** The default fallback fonts in typst. */
export const TYPST_FONT = {
  /** https://docs.rs/crate/typst-library/0.13.1/source/src/text/mod.rs#166 */
  text: "Libertinus Serif",
  /** https://docs.rs/typst-library/0.13.1/src/typst_library/math/equation.rs.html#198 */
  math: "New Computer Modern Math",
  /** https://docs.rs/typst-library/0.13.1/src/typst_library/text/raw.rs.html#479 */
  code: "DejaVu Sans Mono",
};

/** List of fonts embedded in typst. */
export const TYPST_EMBEDDED_FONTS = [
  ...Object.values(TYPST_FONT),
  TYPST_FONT.math.replace(/ Math$/, ""),
];
