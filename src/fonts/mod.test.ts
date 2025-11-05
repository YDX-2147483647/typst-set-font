import { describe, expect, it } from "vitest";
import { calc_advanced, stringify_advanced } from "./advanced.ts";
import { stringify_FontSet } from "./as_typst.ts";
import {
  FallbackRule,
  FontFamilies_from,
  MathFontFamilies_from,
} from "./types.ts";

describe("stringify_FontSet with FontSetAdvanced", () => {
  describe("list_marker_prefer_default", () => {
    it("should combine all features with different fonts and list_marker_prefer_default", () => {
      const font = {
        text: {
          latin: "Arial",
          han: "SimSun",
          rule: FallbackRule.HanFirst as const,
        },
        math: MathFontFamilies_from("Fira Math"),
        code: FontFamilies_from("Fira Mono"),
        list_marker_prefer_default: true,
      };
      const result = stringify_FontSet(font, {
        mode: "markup",
        postscript: stringify_advanced(calc_advanced(font)),
      });
      expect(result).toBe(
        [
          '#set text(font: ((name: "Arial", covers: "latin-in-cjk"), "SimSun"))',
          '#show math.equation: set text(font: "Fira Math")',
          '#show raw: set text(font: "Fira Mono")',
          '#set list(marker: ([•], [‣], [–]).map(text.with(font: "Libertinus Serif")))',
        ].join("\n"),
      );
    });
  });
});
