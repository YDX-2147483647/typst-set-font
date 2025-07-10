<script setup lang="ts">
import { darkTheme, NConfigProvider, NFormItem, NH1, NInput } from "naive-ui";
import { computed, ref } from "vue";
import FontFamiliesSample from "./components/FontFamiliesSample.vue";
import { FontFamilies_from } from "./fonts/types.ts";

const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const theme = ref<typeof darkTheme | null>(
  themeQuery.matches ? darkTheme : null,
);
themeQuery.addEventListener("change", () => {
  theme.value = themeQuery.matches ? darkTheme : null;
});

const font = ref("Source Han Serif");

const fontFamilies = computed(() => FontFamilies_from(font.value));
</script>

<template>
  <n-config-provider :theme="theme">
    <section>
      <n-h1>Typst set font</n-h1>
      <n-form-item label="选择字体">
        <n-input v-model:value="font" type="text" placeholder="输入字体名称" />
      </n-form-item>
      <FontFamiliesSample :font="fontFamilies" />
    </section>
  </n-config-provider>
</template>
