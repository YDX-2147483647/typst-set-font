<script setup lang="ts">
import {
  darkTheme,
  NConfigProvider,
  NForm,
  NFormItem,
  NH1,
  NH2,
  NInput,
  NSelect,
} from "naive-ui";
import { computed, ref } from "vue";
import FontFamiliesSample from "./components/FontFamiliesSample.vue";
import { FallbackRule, FontSet_default } from "./fonts/types.ts";

const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const theme = ref<typeof darkTheme | null>(
  themeQuery.matches ? darkTheme : null,
);
themeQuery.addEventListener("change", () => {
  theme.value = themeQuery.matches ? darkTheme : null;
});

const font = ref(FontSet_default());

const rule_options = [
  {
    label: "中文字体",
    value: FallbackRule.HanFirst,
  },
  {
    label: "Latin 字体",
    value: FallbackRule.LatinFirst,
  },
  {
    label: "正文无中文标点",
    value: FallbackRule.HanOnlyIdeographs,
  },
];
const rule_validation = computed(() => {
  if (font.value.text.han === font.value.text.latin) {
    return "success";
  }
  switch (font.value.text.rule) {
    case FallbackRule.HanFirst:
      return "success";
    case FallbackRule.LatinFirst:
      return "warning";
    case FallbackRule.HanOnlyIdeographs:
      return "warning";
  }
});
// TODO
const feedback = computed(() => {
  if (font.value.text.han === font.value.text.latin) {
    return "中西字体统一，无需设置";
  }
  switch (font.value.text.rule) {
    case FallbackRule.HanFirst:
      return;
    case FallbackRule.LatinFirst:
      // TODO
      return "不建议，可选中文字体，并利用 smartquote 输入 Latin";
    case FallbackRule.HanOnlyIdeographs:
      return "warning";
  }
});
</script>

<template>
  <n-config-provider :theme="theme">
    <main>
      <n-h1>Typst set font</n-h1>
      <div class="lg:grid lg:grid-cols-2 lg:gap-x-8">
        <section class="prose">
          <n-h2>基础字体设置</n-h2>
          <p>保证全文字体都基本正常，不会随机回落或出现豆腐块。</p>
          <n-form
            class="not-prose grid grid-cols-[auto_1fr] gap-x-3 lg:grid-cols-[auto_1fr_1fr_auto] lg:gap-y-3"
          >
            <p
              class="row-span-3 pt-7 text-end font-bold lg:row-span-1 lg:content-center lg:pt-0"
            >
              正文
            </p>
            <n-form-item label="Latin">
              <n-input v-model:value="font.text.latin" type="text" />
            </n-form-item>
            <n-form-item label="中文">
              <n-input v-model:value="font.text.han" type="text" />
            </n-form-item>
            <n-form-item
              label="中西共用标点"
              :validation-status="rule_validation"
              :feedback="font.text.latin === font.text.han ? '无需设置' : null"
            >
              <n-select
                v-model:value="font.text.rule"
                :disabled="font.text.latin === font.text.han"
                :options="rule_options"
              />
            </n-form-item>

            <p
              class="row-span-3 mt-3 pt-7 text-end font-bold lg:row-span-1 lg:mt-0 lg:content-center lg:pt-0"
            >
              代码
            </p>
            <n-form-item class="mt-3 lg:mt-0" label="Latin">
              <n-input v-model:value="font.code.latin" type="text" />
            </n-form-item>
            <n-form-item label="中文">
              <n-input v-model:value="font.code.han" type="text" />
            </n-form-item>
            <n-form-item
              label="中西共用标点"
              :validation-status="rule_validation"
              :feedback="font.code.latin === font.code.han ? '无需设置' : null"
            >
              <n-select
                v-model:value="font.code.rule"
                :disabled="font.code.latin === font.code.han"
                :options="rule_options"
              />
            </n-form-item>

            <p
              class="row-span-4 mt-3 pt-7 text-end font-bold lg:row-span-2 lg:mt-0 lg:content-center lg:pt-0"
            >
              数学
            </p>
            <n-form-item class="mt-3 lg:mt-0" label="Latin">
              <n-input v-model:value="font.math.latin" type="text" />
            </n-form-item>
            <n-form-item label="中文">
              <n-input v-model:value="font.math.han" type="text" />
            </n-form-item>
            <n-form-item
              label="中西共用标点"
              :validation-status="rule_validation"
              :feedback="font.code.latin === font.code.han ? '无需设置' : null"
            >
              <n-select
                v-model:value="font.math.rule"
                :disabled="font.math.latin === font.math.han"
                :options="rule_options"
              />
            </n-form-item>
            <n-form-item
              class="mt-3 lg:col-span-2 lg:mt-0"
              label="数学排版"
              label-placement="left"
            >
              <n-input v-model:value="font.math.math" type="text" />
            </n-form-item>
          </n-form>
        </section>
        <FontFamiliesSample :font="font.text" />
      </div>
    </main>
  </n-config-provider>
</template>
