<script setup lang="ts">
import { NH2 } from "naive-ui";
import { computed } from "vue";
import { FallbackRule, type FontFamilies } from "../fonts/types.ts";
import FontSample from "./FontSample.vue";

const { font } = defineProps<{
  font: FontFamilies;
}>();

const sample = {
  latin: "Aa09,.?!",
  both: "—…“”‘’·",
  han: {
    punct: "，、。？！",
    ideo: "永体體固",
  },
};

const calc_font = computed(() => {
  return {
    latin: font.latin,
    both: font.rule === FallbackRule.HanFirst ? font.han : font.latin,
    han: {
      punct: font.rule === FallbackRule.HanOnlyIdeographs ? null : font.han,
      ideo: font.han,
    },
  };
});
</script>

<template>
  <section class="prose">
    <n-h2>字体测试</n-h2>
    <div
      class="not-prose mx-auto my-4 grid grid-cols-[auto_auto_1fr] items-center gap-3 text-end lg:max-w-4/5"
    >
      <p class="col-span-2">西文独占字符：</p>
      <FontSample :font="calc_font.latin" :text="sample.latin" />
      <p class="col-span-2">
        <a href="http://github.com/w3c/clreq/issues/534">中西共用字符：</a>
      </p>
      <FontSample :font="calc_font.both" :text="sample.both" />
      <p class="row-span-2">中文独占</p>
      <p>标点：</p>
      <FontSample :font="calc_font.han.punct" :text="sample.han.punct" />
      <p>汉字：</p>
      <FontSample :font="calc_font.han.ideo" :text="sample.han.ideo" />
    </div>
    <p>浏览器渲染效果可能与 typst 不同；请以文字描述为准。</p>
  </section>
</template>
