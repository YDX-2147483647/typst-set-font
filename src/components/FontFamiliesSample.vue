<script setup lang="ts">
import { computed, ref } from "vue";
import font_samples_url from "../assets/font_samples.json?url";
import { text_samples } from "../fixtures.ts";
import { TYPST_FONT } from "../fonts/const.ts";
import {
  resolve_FontFamilies,
  resolve_MathFontFamilies,
} from "../fonts/resolve.ts";
import {
  FallbackRule,
  FontSet,
  type FontFamilies,
  type MathFontFamilies,
} from "../fonts/types.ts";
import FontSample from "./FontSample.vue";

const { font, category } = defineProps<
  | {
      font: FontFamilies;
      category: keyof Omit<FontSet, "math">;
    }
  | {
      font: MathFontFamilies;
      category: "math";
    }
>();

/** A lazy-loaded map from font families to SVG samples */
const font_samples = ref<Record<string, typeof text_samples> | null>(null);
fetch(font_samples_url)
  .then((r) => r.text())
  .then((data) => (font_samples.value = JSON.parse(data)));

const calc_font = computed(() => {
  const rule = font.rule;
  const resolved =
    category !== "math"
      ? resolve_FontFamilies(font, category)
      : resolve_MathFontFamilies(font);
  const typst_fallback = TYPST_FONT[category];

  return {
    latin: resolved?.latin ?? typst_fallback,
    both:
      (rule === FallbackRule.HanFirst ? resolved?.han : resolved?.latin) ??
      typst_fallback,
    han: {
      punct:
        rule === FallbackRule.HanOnlyIdeographs
          ? null
          : (resolved?.han ?? null),
      ideo: resolved?.han ?? null,
    },
  };
});

const get_image = computed(
  () =>
    (font: string | null): typeof text_samples | null => {
      const samples = font_samples.value;
      if (samples === null || font === null) {
        return null;
      } else {
        return samples[font] ?? null;
      }
    },
);
</script>

<template>
  <div
    class="not-prose mx-auto my-4 grid grid-cols-[auto_auto_1fr] items-center gap-3 text-end lg:max-w-4/5"
  >
    <p class="col-span-2">西文独占字符：</p>
    <FontSample
      :font="calc_font.latin"
      :text="text_samples.latin"
      :svg="get_image(calc_font.latin)?.latin"
    />
    <p class="col-span-2">
      <a href="http://github.com/w3c/clreq/issues/534">中西共用标点：</a>
    </p>
    <FontSample
      :font="calc_font.both"
      :text="text_samples.both"
      :svg="get_image(calc_font.both)?.both"
    />
    <p class="row-span-2">中文独占</p>
    <p>标点：</p>
    <FontSample
      :font="calc_font.han.punct"
      :text="text_samples.han.punct"
      :svg="get_image(calc_font.han.punct)?.han.punct"
    />
    <p>汉字：</p>
    <FontSample
      :font="calc_font.han.ideo"
      :text="text_samples.han.ideo"
      :svg="get_image(calc_font.han.ideo)?.han.ideo"
    />
  </div>
</template>
