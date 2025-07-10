<script setup lang="ts">
import type { FontFamilies } from "../fonts/types.ts";
import FontSample from "./FontSample.vue";

defineProps<{
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
</script>

<template>
  <section>
    <h2>字体测试</h2>
    <div class="not-prose my-4 grid grid-cols-[auto_auto_1fr] items-center gap-3 text-end">
      <p class="col-span-2">西文独占字符：</p>
      <FontSample :font="font.latin" :text="sample.latin" />
      <p class="col-span-2">
        <a href="http://github.com/w3c/clreq/issues/534">中西共用字符：</a>
      </p>
      <FontSample font="todo" :text="sample.both" />
      <p class="row-span-2">中文独占</p>
      <p>标点：</p>
      <FontSample :font="font.han" :text="sample.han.punct" />
      <p>汉字：</p>
      <FontSample :font="font.han" :text="sample.han.ideo" />
    </div>
    <p>浏览器渲染效果可能与 typst 不同；请以文字描述为准。</p>
  </section>
</template>
