import { describe, expect, it } from "vitest";
import { stringify_FontFamilies, stringify_FontSet } from "./as_typst.ts";
import {
  FallbackRule,
  type FontFamilies,
  FontFamilies_from,
  type MathFontFamilies,
  MathFontFamilies_from,
  type Resolved,
} from "./types.ts";
import { TYPST_FONT } from "./const.ts";

describe("stringify_FontFamilies", () => {
  describe("same font for latin and han", () => {
    it("should generate simple font family for identical latin and han fonts", () => {
      const font = FontFamilies_from("Arial");
      const result = stringify_FontFamilies(font);
      expect(result).toBe('"Arial"');
    });

    it("should work with default font", () => {
      const font = FontFamilies_from(TYPST_FONT.text);
      const result = stringify_FontFamilies(font);
      expect(result).toBe('"Libertinus Serif"');
    });
  });

  describe("different fonts for latin and han", () => {
    it("should generate HanFirst fallback rule", () => {
      const font: Resolved<FontFamilies> = {
        latin: "Arial",
        han: "SimSun",
        rule: FallbackRule.HanFirst,
      };
      const result = stringify_FontFamilies(font);
      expect(result).toBe(
        '((name: "Arial", covers: "latin-in-cjk"), "SimSun")',
      );
    });

    it("should generate LatinFirst fallback rule", () => {
      const font: Resolved<FontFamilies> = {
        latin: "Arial",
        han: "SimSun",
        rule: FallbackRule.LatinFirst,
      };
      const result = stringify_FontFamilies(font);
      expect(result).toBe('("Arial", "SimSun")');
    });

    it("should generate HanOnlyIdeographs fallback rule", () => {
      const font: Resolved<FontFamilies> = {
        latin: "Times New Roman",
        han: "SimSun",
        rule: FallbackRule.HanOnlyIdeographs,
      };
      const result = stringify_FontFamilies(font);
      expect(result).toBe(
        '((name: "SimSun", covers: regex("\\p{Han}")), "Times New Roman")',
      );
    });
  });

  describe("math font families", () => {
    it("should generate math font with same latin/han font", () => {
      const font: Resolved<MathFontFamilies> = {
        latin: "Source Han Serif",
        han: "Source Han Serif",
        rule: FallbackRule.HanFirst,
        math: "New Computer Modern Math",
      };
      const result = stringify_FontFamilies(font);
      expect(result).toBe('("Source Han Serif", "New Computer Modern Math")');
    });

    it("should generate math font with different latin/han fonts", () => {
      const font: Resolved<MathFontFamilies> = {
        latin: "Arial",
        han: "SimSun",
        rule: FallbackRule.LatinFirst,
        math: "New Computer Modern Math",
      };
      const result = stringify_FontFamilies(font);
      expect(result).toBe('("Arial", "SimSun", "New Computer Modern Math")');
    });

    it("should work with default math font families", () => {
      const font = MathFontFamilies_from(TYPST_FONT.math);
      const result = stringify_FontFamilies(font);
      expect(result).toBe('"New Computer Modern Math"');
    });

    it("should generate math font with HanFirst rule", () => {
      const font: Resolved<MathFontFamilies> = {
        latin: "Times New Roman",
        han: "SimSun",
        rule: FallbackRule.HanFirst,
        math: "TeX Gyre Termes Math",
      };
      const result = stringify_FontFamilies(font);
      expect(result).toBe(
        '((name: "Times New Roman", covers: "latin-in-cjk"), "SimSun", "TeX Gyre Termes Math")',
      );
    });

    it("should generate math font with HanOnlyIdeographs rule", () => {
      const font: Resolved<MathFontFamilies> = {
        latin: "New Computer Modern",
        han: "Noto Serif CJK SC",
        rule: FallbackRule.HanOnlyIdeographs,
        math: "New Computer Modern Math",
      };
      const result = stringify_FontFamilies(font);
      expect(result).toBe(
        '((name: "Noto Serif CJK SC", covers: regex("\\p{Han}")), "New Computer Modern", "New Computer Modern Math")',
      );
    });
  });

  describe("edge cases", () => {
    it("should handle empty font names", () => {
      const font = FontFamilies_from("");
      const result = stringify_FontFamilies(font);
      expect(result).toBe('""');
    });

    it("should handle font names with quotes", () => {
      const font = FontFamilies_from('Font "Name"');
      const result = stringify_FontFamilies(font);
      expect(result).toBe('"Font \\"Name\\""');
    });
  });
});

describe("stringify_FontSet", () => {
  const arial = FontFamilies_from("Arial");
  const arial_math = { ...arial, math: "Arial" }; // a fictional font

  it("should generate code mode output with identical fonts", () => {
    const fontSet = {
      text: arial,
      math: arial_math,
      code: arial,
    };
    const result = stringify_FontSet(fontSet, { mode: "code" });
    expect(result).toBe(
      [
        'set text(font: "Arial")',
        'show math.equation: set text(font: "Arial")',
        'show raw: set text(font: "Arial")',
      ].join("\n"),
    );
  });

  it("should generate markup mode output with identical fonts", () => {
    const fontSet = {
      text: arial,
      math: arial_math,
      code: arial,
    };
    const result = stringify_FontSet(fontSet, { mode: "markup" });
    expect(result).toBe(
      [
        '#set text(font: "Arial")',
        '#show math.equation: set text(font: "Arial")',
        '#show raw: set text(font: "Arial")',
      ].join("\n"),
    );
  });

  it("should generate code mode output with different fonts", () => {
    const fontSet = {
      text: {
        latin: "Arial",
        han: "SimSun",
        rule: FallbackRule.LatinFirst,
      },
      math: MathFontFamilies_from("Fira Math"),
      code: FontFamilies_from("Fira Mono"),
    };
    const result = stringify_FontSet(fontSet, { mode: "code" });
    expect(result).toBe(
      [
        'set text(font: ("Arial", "SimSun"))',
        'show math.equation: set text(font: "Fira Math")',
        'show raw: set text(font: "Fira Mono")',
      ].join("\n"),
    );
  });

  it("should generate good default with default fonts", () => {
    const fontSet = {
      text: FontFamilies_from(TYPST_FONT.text),
      code: FontFamilies_from(TYPST_FONT.code),
      math: MathFontFamilies_from(TYPST_FONT.math),
    };
    const result = stringify_FontSet(fontSet, { mode: "markup" });
    expect(result).toBe(
      [
        '#set text(font: "Libertinus Serif")',
        '#show math.equation: set text(font: "New Computer Modern Math")',
        '#show raw: set text(font: "DejaVu Sans Mono")',
      ].join("\n"),
    );
  });

  it("should work if some elements are ignored", () => {
    expect(
      stringify_FontSet(
        {
          text: arial,
          math: null,
          code: arial,
        },
        { mode: "code" },
      ),
    ).toBe(
      ['set text(font: "Arial")', 'show raw: set text(font: "Arial")'].join(
        "\n",
      ),
    );

    expect(
      stringify_FontSet(
        {
          text: arial,
          math: null,
          code: null,
        },
        { mode: "code" },
      ),
    ).toBe('set text(font: "Arial")');

    expect(
      stringify_FontSet(
        {
          text: null,
          math: null,
          code: null,
        },
        { mode: "code" },
      ),
    ).toBe("");
  });
});
