import { describe, expect, it } from "vitest";
import {
  resolve_FontFamilies,
  resolve_FontSet,
  resolve_MathFontFamilies,
} from "./resolve.ts";
import {
  FallbackRule,
  FontFamilies_empty,
  FontFamilies_from,
  FontSet_empty,
  MathFontFamilies_empty,
  type FontFamilies,
  type MathFontFamilies,
} from "./types.ts";

describe("resolve_FontFamilies", () => {
  describe("non-math categories", () => {
    it("should resolve font with both latin and han specified", () => {
      const font: FontFamilies = {
        latin: "Arial",
        han: "SimSun",
        rule: FallbackRule.LatinFirst,
      };
      const result = resolve_FontFamilies(font, "text");
      expect(result).toEqual({
        latin: "Arial",
        han: "SimSun",
        rule: FallbackRule.LatinFirst,
      });
    });

    it("should resolve font with only latin specified", () => {
      const font: FontFamilies = {
        latin: "Arial",
        han: null,
        rule: FallbackRule.LatinFirst,
      };
      const result = resolve_FontFamilies(font, "text");
      expect(result).toEqual({
        latin: "Arial",
        han: "Arial",
        rule: FallbackRule.LatinFirst,
      });
    });

    it("should resolve font with only han specified", () => {
      const font: FontFamilies = {
        latin: null,
        han: "SimSun",
        rule: FallbackRule.HanFirst,
      };
      const result = resolve_FontFamilies(font, "code");
      expect(result).toEqual({
        latin: "DejaVu Sans Mono",
        han: "SimSun",
        rule: FallbackRule.HanFirst,
      });
    });

    it("should return null when no fonts are specified", () => {
      const font = FontFamilies_empty();
      const result = resolve_FontFamilies(font, "text");
      expect(result).toBe(null);
    });

    it("should work with different categories", () => {
      const font = FontFamilies_from("Fira Code");
      const result = resolve_FontFamilies(font, "code");
      expect(result).toEqual({
        latin: "Fira Code",
        han: "Fira Code",
        rule: FallbackRule.HanFirst,
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty string fonts", () => {
      const font: FontFamilies = {
        latin: "",
        han: null,
        rule: FallbackRule.LatinFirst,
      };
      const result = resolve_FontFamilies(font, "text");
      expect(result).toEqual(null);
    });

    it("should handle undefined fonts", () => {
      const font: FontFamilies = FontFamilies_empty();
      font.latin = "Arial";
      font.han = undefined;
      const result = resolve_FontFamilies(font, "text");
      expect(result).toEqual({
        latin: "Arial",
        han: "Arial",
        rule: FallbackRule.HanFirst,
      });
    });
  });
});

describe("resolve_FontFamilies", () => {
  describe("math category without specifying math font", () => {
    it("should resolve math font with latin and han specified", () => {
      const font: FontFamilies = {
        latin: "Libertinus Serif",
        han: "Source Han Serif SC",
        rule: FallbackRule.LatinFirst,
      };
      const result = resolve_MathFontFamilies(font);
      expect(result).toEqual({
        latin: "Libertinus Serif",
        han: "Source Han Serif SC",
        math: "New Computer Modern Math",
        rule: FallbackRule.LatinFirst,
      });
    });

    it("should resolve math font with latin specified", () => {
      const font: FontFamilies = {
        latin: "Computer Modern",
        han: null,
        rule: FallbackRule.LatinFirst,
      };
      const result = resolve_MathFontFamilies(font);
      expect(result).toEqual({
        latin: "Computer Modern",
        han: "Computer Modern",
        math: "New Computer Modern Math",
        rule: FallbackRule.LatinFirst,
      });
    });

    it("should resolve math font with han specified", () => {
      const font: FontFamilies = {
        latin: null,
        han: "Noto Serif CJK SC",
        rule: FallbackRule.HanFirst,
      };
      const result = resolve_MathFontFamilies(font);
      expect(result).toEqual({
        latin: "New Computer Modern Math",
        han: "Noto Serif CJK SC",
        math: "New Computer Modern Math",
        rule: FallbackRule.HanFirst,
      });
    });

    it("should return null when no fonts specified", () => {
      const font = FontFamilies_empty();
      const result = resolve_MathFontFamilies(font);
      expect(result).toBe(null);
    });
  });

  describe("MathFontFamilies", () => {
    it("should resolve math font families with all fonts specified", () => {
      const font: MathFontFamilies = {
        latin: "Times New Roman",
        han: "SimSun",
        math: "TeX Gyre Termes Math",
        rule: FallbackRule.LatinFirst,
      };
      const result = resolve_MathFontFamilies(font);
      expect(result).toEqual({
        latin: "Times New Roman",
        han: "SimSun",
        math: "TeX Gyre Termes Math",
        rule: FallbackRule.LatinFirst,
      });
    });

    it("should resolve with only math font specified", () => {
      const font: MathFontFamilies = {
        latin: null,
        han: null,
        math: "Asana Math",
        rule: FallbackRule.HanFirst,
      };
      const result = resolve_MathFontFamilies(font);
      expect(result).toEqual({
        latin: "Asana Math",
        han: "Asana Math",
        math: "Asana Math",
        rule: FallbackRule.HanFirst,
      });
    });

    it("should resolve with only latin and math specified", () => {
      const font: MathFontFamilies = {
        latin: "Libertinus Serif",
        han: null,
        math: "Libertinus Math",
        rule: FallbackRule.LatinFirst,
      };
      const result = resolve_MathFontFamilies(font);
      expect(result).toEqual({
        latin: "Libertinus Serif",
        han: "Libertinus Serif",
        math: "Libertinus Math",
        rule: FallbackRule.LatinFirst,
      });
    });

    it("should resolve with only han and math specified", () => {
      const font: MathFontFamilies = {
        latin: null,
        han: "Noto Serif CJK SC",
        math: null,
        rule: FallbackRule.LatinFirst,
      };
      const result = resolve_MathFontFamilies(font);
      expect(result).toEqual({
        latin: "New Computer Modern Math",
        han: "Noto Serif CJK SC",
        math: "New Computer Modern Math",
        rule: FallbackRule.LatinFirst,
      });
    });

    it("should return null when no fonts specified in MathFontFamilies", () => {
      const font = MathFontFamilies_empty();
      const result = resolve_MathFontFamilies(font);
      expect(result).toBe(null);
    });
  });
});

describe("resolve_FontSet", () => {
  it("should resolve all categories with specified fonts", () => {
    const fontSet = {
      text: FontFamilies_from("Times New Roman"),
      math: {
        latin: "Computer Modern",
        han: null,
        math: "Computer Modern Math",
        rule: FallbackRule.LatinFirst,
      } as MathFontFamilies,
      code: FontFamilies_from("Fira Code"),
    };

    const result = resolve_FontSet(fontSet);

    expect(result).toEqual({
      text: {
        latin: "Times New Roman",
        han: "Times New Roman",
        rule: FallbackRule.HanFirst,
      },
      math: {
        latin: "Computer Modern",
        han: "Computer Modern",
        math: "Computer Modern Math",
        rule: FallbackRule.LatinFirst,
      },
      code: {
        latin: "Fira Code",
        han: "Fira Code",
        rule: FallbackRule.HanFirst,
      },
    });
  });

  it("should return null for categories with no fonts specified", () => {
    const fontSet = FontSet_empty();
    const result = resolve_FontSet(fontSet);

    expect(result).toEqual({
      text: null,
      math: null,
      code: null,
    });
  });

  it("should handle mixed scenarios with some categories having fonts and others empty", () => {
    const fontSet = {
      text: FontFamilies_from("Arial"),
      math: FontFamilies_empty(),
      code: {
        latin: "Monaco",
        han: "Source Han Code JP",
        rule: FallbackRule.HanFirst,
      } as FontFamilies,
    };

    const result = resolve_FontSet(fontSet);

    expect(result).toEqual({
      text: {
        latin: "Arial",
        han: "Arial",
        rule: FallbackRule.HanFirst,
      },
      math: null,
      code: {
        latin: "Monaco",
        han: "Source Han Code JP",
        rule: FallbackRule.HanFirst,
      },
    });
  });

  it("should properly resolve math category with MathFontFamilies", () => {
    const fontSet = {
      text: FontFamilies_from("Serif"),
      math: {
        latin: "Latin Modern Roman",
        han: null,
        math: "Latin Modern Math",
        rule: FallbackRule.LatinFirst,
      } as MathFontFamilies,
      code: FontFamilies_from("Monospace"),
    };

    const result = resolve_FontSet(fontSet);

    expect(result.math).toEqual({
      latin: "Latin Modern Roman",
      han: "Latin Modern Roman",
      math: "Latin Modern Math",
      rule: FallbackRule.LatinFirst,
    });
  });

  it("should preserve additional properties while resolving fonts", () => {
    const font = {
      text: FontFamilies_from("Arial"),
      math: {
        latin: "Computer Modern",
        han: null,
        math: "Computer Modern Math",
        rule: FallbackRule.LatinFirst,
      } as MathFontFamilies,
      code: FontFamilies_from("Consolas"),
    };
    const additional = {
      attr: "whatever",
    };

    expect(
      resolve_FontSet({
        ...font,
        ...additional,
      }),
    ).toEqual({
      ...resolve_FontSet(font),
      ...additional,
    });
  });
});
