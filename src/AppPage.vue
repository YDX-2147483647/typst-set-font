<script setup lang="ts">
import { darkTheme, NConfigProvider, GlobalThemeOverrides } from "naive-ui";
import { ref } from "vue";
import AppMain from "./AppMain.vue";

const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const theme = ref<typeof darkTheme | null>(
  themeQuery.matches ? darkTheme : null,
);
themeQuery.addEventListener("change", () => {
  theme.value = themeQuery.matches ? darkTheme : null;
});

const themOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#239dad",
  },
};
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themOverrides">
    <AppMain />
  </n-config-provider>
</template>
