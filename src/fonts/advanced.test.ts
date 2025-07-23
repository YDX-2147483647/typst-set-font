import { describe, expect, it } from "vitest";
import { calc_advanced, stringify_advanced } from "./advanced.ts";
import {
  FallbackRule,
  FontFamilies_empty,
  FontFamilies_from,
  FontSet_empty,
  type FontSetAdvanced,
  type MathFontFamilies,
} from "./types.ts";
import { TYPST_FONT } from "./const.ts";

describe("calc_advanced", () => {
  describe("when text font is null", () => {
    it("should return null for all advanced features", () => {
      const font: FontSetAdvanced = {
        ...FontSet_empty(),
        smartquote_for_latin: true,
        list_marker_prefer_default: true,
      };

      const result = calc_advanced(font);

      expect(result).toEqual({
        text: null,
        math: null,
        code: null,
        smartquote_for_latin: null,
        list_marker_prefer_default: null,
      });
    });

    it("should handle undefined advanced properties", () => {
      const font: FontSetAdvanced = FontSet_empty();

      const result = calc_advanced(font);

      expect(result).toEqual({
        text: null,
        math: null,
        code: null,
        smartquote_for_latin: null,
        list_marker_prefer_default: null,
      });
    });
  });

  describe("when text font is not null", () => {
    describe("smartquote_for_latin", () => {
      it("should enable smartquote when han is specified and rule is HanFirst", () => {
        const font: FontSetAdvanced = {
          text: {
            latin: "Arial",
            han: "SimSun",
            rule: FallbackRule.HanFirst,
          },
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          smartquote_for_latin: true,
        };

        const result = calc_advanced(font);

        expect(result.smartquote_for_latin).toBe(true);
        expect(result.text).toEqual({
          latin: "Arial",
          han: "SimSun",
          rule: FallbackRule.HanFirst,
        });
      });

      it("should disable smartquote when explicitly set to false", () => {
        const font: FontSetAdvanced = {
          text: {
            latin: "Arial",
            han: "SimSun",
            rule: FallbackRule.HanFirst,
          },
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          smartquote_for_latin: false,
        };

        const result = calc_advanced(font);

        expect(result.smartquote_for_latin).toBe(false);
      });

      it("should default to false when not specified", () => {
        const font: FontSetAdvanced = {
          text: {
            latin: "Arial",
            han: "SimSun",
            rule: FallbackRule.HanFirst,
          },
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
        };

        const result = calc_advanced(font);

        expect(result.smartquote_for_latin).toBe(false);
      });

      it("should return null when rule is LatinFirst", () => {
        const font: FontSetAdvanced = {
          text: {
            latin: "Arial",
            han: "SimSun",
            rule: FallbackRule.LatinFirst,
          },
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          smartquote_for_latin: true,
        };

        const result = calc_advanced(font);

        expect(result.smartquote_for_latin).toBe(null);
      });

      it("should return null when han is not specified", () => {
        const font: FontSetAdvanced = {
          text: FontFamilies_empty(),
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          smartquote_for_latin: true,
        };
        font.text.latin = "Arial";
        font.text.han = undefined;

        const result = calc_advanced(font);

        expect(result.smartquote_for_latin).toBe(null);
      });

      it("should return null when han is null", () => {
        const font: FontSetAdvanced = {
          text: {
            latin: "Arial",
            han: null,
            rule: FallbackRule.HanFirst,
          },
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          smartquote_for_latin: true,
        };

        const result = calc_advanced(font);

        expect(result.smartquote_for_latin).toBe(null);
      });
    });

    describe("list_marker_prefer_default", () => {
      it("should enable list_marker_prefer_default when latin font is not TYPST_FONT", () => {
        const font: FontSetAdvanced = {
          text: FontFamilies_from("Arial"),
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          list_marker_prefer_default: true,
        };

        const result = calc_advanced(font);

        expect(result.list_marker_prefer_default).toBe(true);
      });

      it("should disable list_marker_prefer_default when explicitly set to false", () => {
        const font: FontSetAdvanced = {
          text: FontFamilies_from("Arial"),
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          list_marker_prefer_default: false,
        };

        const result = calc_advanced(font);

        expect(result.list_marker_prefer_default).toBe(false);
      });

      it("should default to false when not specified", () => {
        const font: FontSetAdvanced = {
          text: FontFamilies_from("Arial"),
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
        };

        const result = calc_advanced(font);

        expect(result.list_marker_prefer_default).toBe(false);
      });

      it("should return null when latin font is TYPST_FONT", () => {
        const font: FontSetAdvanced = {
          text: FontFamilies_from(TYPST_FONT.text),
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          list_marker_prefer_default: true,
        };

        const result = calc_advanced(font);

        expect(result.list_marker_prefer_default).toBe(null);
      });

      it("should work with resolved fonts", () => {
        const font: FontSetAdvanced = {
          text: {
            latin: null,
            han: "SimSun",
            rule: FallbackRule.HanFirst,
          },
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          list_marker_prefer_default: true,
        };

        const result = calc_advanced(font);

        // Should resolve latin to "New Computer Modern" which is not TYPST_FONT.text
        expect(result.list_marker_prefer_default).toBe(null);
      });
    });

    describe("combined scenarios", () => {
      it("should handle both advanced features enabled", () => {
        const font: FontSetAdvanced = {
          text: {
            latin: "Arial",
            han: "SimSun",
            rule: FallbackRule.HanFirst,
          },
          math: FontFamilies_empty(),
          code: FontFamilies_empty(),
          smartquote_for_latin: true,
          list_marker_prefer_default: true,
        };

        const result = calc_advanced(font);

        expect(result.smartquote_for_latin).toBe(true);
        expect(result.list_marker_prefer_default).toBe(true);
      });

      it("should resolve fonts for math and code categories", () => {
        const font: FontSetAdvanced = {
          text: FontFamilies_from("Arial"),
          math: {
            latin: "Computer Modern",
            han: null,
            math: "Computer Modern Math",
            rule: FallbackRule.LatinFirst,
          } as MathFontFamilies,
          code: FontFamilies_from("Fira Code"),
        };

        const result = calc_advanced(font);

        expect(result.math).toEqual({
          latin: "Computer Modern",
          han: "Computer Modern",
          math: "Computer Modern Math",
          rule: FallbackRule.LatinFirst,
        });
        expect(result.code).toEqual({
          latin: "Fira Code",
          han: "Fira Code",
          rule: FallbackRule.HanFirst,
        });
      });
    });
  });
});

describe("stringify_advanced", () => {
  describe("smartquote_for_latin", () => {
    it("should generate pwid feature when latin and han fonts are the same", () => {
      const font = calc_advanced({
        text: {
          latin: "Source Han Serif",
          han: "Source Han Serif",
          rule: FallbackRule.HanFirst,
        },
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        smartquote_for_latin: true,
      });

      const result = stringify_advanced(font);

      expect(result).toContain(
        `show smartquote: set text(features: ("pwid",))`,
      );
    });

    it("should generate font setting when latin and han fonts are different", () => {
      const font = calc_advanced({
        text: {
          latin: "Arial",
          han: "SimSun",
          rule: FallbackRule.HanFirst,
        },
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        smartquote_for_latin: true,
      });

      const result = stringify_advanced(font);

      expect(result).toContain(`show smartquote: set text(font: "Arial")`);
    });

    it("should not generate smartquote rule when disabled", () => {
      const font = calc_advanced({
        text: {
          latin: "Arial",
          han: "SimSun",
          rule: FallbackRule.HanFirst,
        },
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        smartquote_for_latin: false,
      });

      const result = stringify_advanced(font);

      expect(result.some((rule) => rule?.includes("smartquote"))).toBe(false);
    });

    it("should not generate smartquote rule when null", () => {
      const font = calc_advanced({
        text: { latin: "Arial", han: "SimSun", rule: FallbackRule.LatinFirst },
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        smartquote_for_latin: true,
      });

      const result = stringify_advanced(font);

      expect(result.some((rule) => rule?.includes("smartquote"))).toBe(false);
    });
  });

  describe("list_marker_prefer_default", () => {
    it("should generate list marker rule when enabled", () => {
      const font = calc_advanced({
        text: FontFamilies_from("Arial"),
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        list_marker_prefer_default: true,
      });

      const result = stringify_advanced(font);

      expect(result).toContain(
        `set list(marker: ([•], [‣], [–]).map(text.with(font: "${TYPST_FONT.text}")))`,
      );
    });

    it("should not generate list marker rule when disabled", () => {
      const font = calc_advanced({
        text: FontFamilies_from("Arial"),
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        list_marker_prefer_default: false,
      });

      const result = stringify_advanced(font);

      expect(result.some((rule) => rule?.includes("list"))).toBe(false);
    });

    it("should not generate list marker rule when null", () => {
      const font = calc_advanced({
        text: FontFamilies_from(TYPST_FONT.text),
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        list_marker_prefer_default: true,
      });

      const result = stringify_advanced(font);

      expect(result.some((rule) => rule?.includes("list"))).toBe(false);
    });
  });

  describe("combined scenarios", () => {
    it("should generate both rules when both features are enabled", () => {
      const font = calc_advanced({
        text: {
          latin: "Arial",
          han: "SimSun",
          rule: FallbackRule.HanFirst,
        },
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        smartquote_for_latin: true,
        list_marker_prefer_default: true,
      });

      const result = stringify_advanced(font);

      expect(result).toHaveLength(2);
      expect(result).toContain(`show smartquote: set text(font: "Arial")`);
      expect(result).toContain(
        `set list(marker: ([•], [‣], [–]).map(text.with(font: "${TYPST_FONT.text}")))`,
      );
    });

    it("should return empty array when no features are enabled", () => {
      const font = calc_advanced({
        text: FontFamilies_from(TYPST_FONT.text),
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        smartquote_for_latin: false,
        list_marker_prefer_default: false,
      });

      const result = stringify_advanced(font);

      expect(result).toEqual([]);
    });

    it("should filter out null rules correctly", () => {
      const font = calc_advanced({
        text: { latin: "Arial", han: null, rule: FallbackRule.HanFirst },
        math: FontFamilies_empty(),
        code: FontFamilies_empty(),
        smartquote_for_latin: true, // Will be null due to missing han
        list_marker_prefer_default: true,
      });

      const result = stringify_advanced(font);

      expect(result).toHaveLength(1);
      expect(result).toContain(
        `set list(marker: ([•], [‣], [–]).map(text.with(font: "${TYPST_FONT.text}")))`,
      );
    });
  });
});
