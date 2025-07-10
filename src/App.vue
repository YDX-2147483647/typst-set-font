<script setup lang="ts">
import { computed, ref } from "vue";
import FontFamiliesSample from "./components/FontFamiliesSample.vue";
import { FontFamilies_from } from "./fonts/types.ts";

const font = ref("Source Han Serif");

const fontFamilies = computed(() => FontFamilies_from(font.value));
</script>

<template>
  <section class="prose">
    <h1>Typst set font</h1>
    <label class="not-prose flex flex-col space-y-2">
      <span>选择字体</span>
      <input
        v-model="font"
        type="text"
        placeholder="输入字体名称"
        class="rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />
    </label>
    <FontFamiliesSample :font="fontFamilies" />
  </section>
</template>
