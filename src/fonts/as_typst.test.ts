import { describe, expect, it } from "vitest";
import {
  calculate_MathFontFamilies,
  stringify_FontFamilies,
  stringify_FontSet,
  stringify_MathFontFamilies,
} from "./as_typst.ts";
import { TYPST_FONT } from "./const.ts";
import {
  FallbackRule,
  type FontFamilies,
  FontFamilies_from,
  type MathFontFamilies,
  MathFontFamilies_from,
  type Resolved,
} from "./types.ts";

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

describe("calculate_MathFontFamilies", () => {
  const fonts = ["A", "B", "C"];
  const rules = [
    FallbackRule.LatinFirst,
    FallbackRule.HanFirst,
    FallbackRule.MathFirst,
    FallbackRule.HanOnlyIdeographs,
  ];

  const combinations = fonts.flatMap((latin) =>
    fonts.flatMap((han) =>
      fonts.flatMap((math) =>
        rules.flatMap((rule) => {
          const font = { latin, han, math, rule };
          const result = calculate_MathFontFamilies(font);
          return { font, result };
        }),
      ),
    ),
  );

  it(`the first font without covers should be the math font`, () => {
    const unexpected = combinations
      .map(({ font, result }) => ({
        font,
        result,
        first_without_covers: result.filter((f) => typeof f === "string")[0],
      }))
      .filter(
        ({ font: { math }, first_without_covers }) =>
          math !== first_without_covers,
      );
    expect(unexpected).toEqual([]);
  });

  it(`the full coverage of the han font should be used, except HanOnlyIdeographs`, () => {
    const unexpected = combinations
      .filter(({ font: { rule } }) => rule != FallbackRule.HanOnlyIdeographs)
      .map(({ font, result }) => ({
        font,
        result,
        fully_used: result
          .filter(
            (f) =>
              typeof f === "string" ||
              (typeof f.covers !== "string" && f.covers.repr === 'regex(".")'),
          )
          .map((f) => (typeof f === "string" ? f : f.name)),
      }))
      .filter(({ font: { han }, fully_used }) => !fully_used.includes(han));
    expect(unexpected).toEqual([]);
  });

  it(`all specified fonts should be used`, () => {
    const unexpected = combinations
      .map(({ font, result }) => ({
        font,
        result,
        used: new Set(result.map((f) => (typeof f === "string" ? f : f.name))),
      }))
      .filter(
        ({ font: { math, han, latin }, used }) =>
          ![math, han, latin].every((f) => used.has(f)),
      );
    expect(unexpected).toEqual([]);
  });
});

describe("stringify_MathFontFamilies", () => {
  describe("should generate math font with HanFirst rule", () => {
    const rule = FallbackRule.HanFirst;

    it("use different fonts for all categories", () => {
      const font: Resolved<MathFontFamilies> = {
        latin: "Times New Roman",
        han: "SimSun",
        math: "TeX Gyre Termes Math",
        rule,
      };
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe(
        '((name: "Times New Roman", covers: regex("[.\\d\\p{Latin}]")), (name: "SimSun", covers: regex("[·–—‘’“”‥…‧⸺]")), "TeX Gyre Termes Math", "SimSun")',
      );
    });

    it("should work with default math font families", () => {
      const font = MathFontFamilies_from(TYPST_FONT.math);
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe('"New Computer Modern Math"');
    });

    it("math = latin ≠ han with HanFirst rule", () => {
      const font = {
        latin: "Fira Math",
        han: "KaiTi",
        math: "Fira Math",
        rule: FallbackRule.HanFirst,
      } as const;
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe(
        '((name: "Fira Math", covers: "latin-in-cjk"), (name: "KaiTi", covers: regex(".")), "Fira Math")',
      );
    });

    it("math ≠ latin = han with HanFirst rule", () => {
      const font = {
        latin: "Noto Serif CJK SC",
        han: "Noto Serif CJK SC",
        math: "Fira Math",
        rule: FallbackRule.HanFirst,
      } as const;
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe(
        '((name: "Noto Serif CJK SC", covers: regex("[.\\d\\p{Latin}·–—‘’“”‥…‧⸺]")), "Fira Math", "Noto Serif CJK SC")',
      );
    });

    it("math = han ≠ latin with HanFirst rule", () => {
      const font = {
        latin: "TeX Gyre Termes",
        han: "奢望",
        math: "奢望",
        rule: FallbackRule.HanFirst,
      } as const;
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe('("奢望", "TeX Gyre Termes")');
    });
  });

  describe("should generate math font with MathFirst rule", () => {
    const rule = FallbackRule.MathFirst;

    it("should generate math font with same latin/han font", () => {
      const font: Resolved<MathFontFamilies> = {
        latin: "Source Han Serif",
        han: "Source Han Serif",
        math: "New Computer Modern Math",
        rule,
      };
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe('("New Computer Modern Math", "Source Han Serif")');
    });

    it("should generate math font with different latin/han fonts", () => {
      const font: Resolved<MathFontFamilies> = {
        latin: "Arial",
        han: "SimSun",
        math: "New Computer Modern Math",
        rule,
      };
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe(
        '((name: "Arial", covers: regex("[.\\d\\p{Latin}]")), "New Computer Modern Math", "SimSun")',
      );
    });
  });

  describe("should generate math font with LatinFirst rule", () => {
    const rule = FallbackRule.LatinFirst;

    it("math = latin ≠ han with LatinFirst rule", () => {
      const font = {
        latin: "Fira Math",
        han: "KaiTi",
        math: "Fira Math",
        rule,
      } as const;
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe('("Fira Math", "KaiTi")');
    });

    it("math ≠ latin = han with LatinFirst rule", () => {
      const font = {
        latin: "Source Han Sans",
        han: "Source Han Sans",
        math: "DejaVu Math",
        rule,
      } as const;
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe(
        '((name: "Source Han Sans", covers: regex("[.\\d\\p{Latin}·–—‘’“”‥…‧⸺]")), "DejaVu Math", "Source Han Sans")',
      );
    });

    it("math = han ≠ latin with LatinFirst rule", () => {
      const font = {
        latin: "Helvetica",
        han: "奢望",
        math: "奢望",
        rule,
      } as const;
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe(
        '((name: "Helvetica", covers: regex("[.\\d\\p{Latin}·–—‘’“”‥…‧⸺]")), "奢望", "Helvetica")',
      );
    });

    it("math ≠ latin ≠ han with LatinFirst rule", () => {
      const font = {
        latin: "Times New Roman",
        han: "SimSun",
        math: "TeX Gyre Termes Math",
        rule,
      } as const;
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe(
        '((name: "Times New Roman", covers: regex("[.\\d\\p{Latin}·–—‘’“”‥…‧⸺]")), "TeX Gyre Termes Math", "SimSun")',
      );
    });
  });

  describe("should generate math font with HanOnlyIdeographs rule", () => {
    const rule = FallbackRule.HanOnlyIdeographs;

    it("use New Computer Modern for latin", () => {
      const font: Resolved<MathFontFamilies> = {
        latin: "New Computer Modern",
        han: "Noto Serif CJK SC",
        math: "New Computer Modern Math",
        rule,
      };
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe(
        '((name: "New Computer Modern", covers: regex("[.\\d\\p{Latin}]")), (name: "Noto Serif CJK SC", covers: regex("\\p{Han}")), "New Computer Modern Math")',
      );
    });

    it("use New Computer Modern Math for latin", () => {
      const font: Resolved<MathFontFamilies> = {
        latin: "New Computer Modern Math",
        han: "Noto Serif CJK SC",
        math: "New Computer Modern Math",
        rule,
      };
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe('("New Computer Modern Math", "Noto Serif CJK SC")');
    });

    it("math = latin ≠ han with HanOnlyIdeographs rule", () => {
      const font = {
        latin: "TeX Gyre Termes Math",
        han: "SimSun",
        math: "TeX Gyre Termes Math",
        rule,
      };
      const result = stringify_MathFontFamilies(font);
      expect(result).toBe('("TeX Gyre Termes Math", "SimSun")');
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
        rule: FallbackRule.LatinFirst as const,
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
