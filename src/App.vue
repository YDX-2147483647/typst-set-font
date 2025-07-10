<script setup lang="ts">
import {
  darkTheme,
  NCard,
  NConfigProvider,
  NFormItem,
  NH1,
  NH2,
  NInput,
  NRadioButton,
  NRadioGroup,
} from "naive-ui";
import { computed, reactive, ref } from "vue";
import FontFamiliesSample from "./components/FontFamiliesSample.vue";
import { stringify_FontSet } from "./fonts/as_typst.ts";
import { FallbackRule, FontSet_default } from "./fonts/types.ts";

const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const theme = ref<typeof darkTheme | null>(
  themeQuery.matches ? darkTheme : null,
);
themeQuery.addEventListener("change", () => {
  theme.value = themeQuery.matches ? darkTheme : null;
});

const font = reactive(FontSet_default());

function build_validator(
  fn: () => {
    status: "success" | "warning" | "error" | "irrelevant";
    feedback?: string;
  },
): {
  status: "success" | "warning" | "error";
  disabled: boolean;
  feedback?: string;
} {
  const { status, feedback } = fn();
  return {
    status: status === "irrelevant" ? "success" : status,
    disabled: status === "irrelevant",
    feedback,
  };
}

const config = computed<
  Record<
    string,
    {
      label: string;
      data: Record<
        string,
        {
          label: string;
          options?: { label: string; key: string | number }[];
          validate?: ReturnType<typeof build_validator>;
        }
      >;
    }
  >
>(() => ({
  text: {
    label: "正文",
    data: {
      latin: { label: "Latin 字体" },
      han: { label: "中文字体" },
      rule: {
        label: "中西共用标点",
        options: [
          {
            label: "中文字体",
            key: FallbackRule.HanFirst,
          },
          {
            label: "Latin 字体",
            key: FallbackRule.LatinFirst,
          },
          {
            label: "正文无中文标点",
            key: FallbackRule.HanOnlyIdeographs,
          },
        ],
        validate: build_validator(() => {
          const f = font.text;
          if (f.han === f.latin) {
            return { status: "irrelevant", feedback: "中西字体统一，无需设置" };
          }
          switch (f.rule) {
            case FallbackRule.HanFirst:
              return { status: "success" };
            case FallbackRule.LatinFirst:
              return {
                status: "warning",
                feedback:
                  "不建议，可选中文字体，并利用 smartquote 输入 Latin 标点",
              };
            case FallbackRule.HanOnlyIdeographs:
              return {
                status: "warning",
                feedback: "可能导致逗号等中文独占标点变成□，建议改选“中文字体”",
              };
          }
        }),
      },
    },
  },
  code: {
    label: "代码",
    data: {
      latin: { label: "Latin 字体" },
      han: { label: "中文字体" },
      rule: {
        label: "中西共用标点",
        options: [
          {
            label: "中文字体",
            key: FallbackRule.HanFirst,
          },
          {
            label: "Latin 字体",
            key: FallbackRule.LatinFirst,
          },
          {
            label: "代码无中文标点",
            key: FallbackRule.HanOnlyIdeographs,
          },
        ],
        validate: build_validator(() => {
          const f = font.code;
          if (f.han === f.latin) {
            return { status: "irrelevant", feedback: "中西字体统一，无需设置" };
          }
          switch (f.rule) {
            case FallbackRule.HanFirst:
              return { status: "success" };
            case FallbackRule.LatinFirst:
              return { status: "success" };

            case FallbackRule.HanOnlyIdeographs:
              return {
                status: "warning",
                feedback: "可能导致逗号等中文独占标点变成□，建议改选“中文字体”",
              };
          }
        }),
      },
    },
  },
  math: {
    label: "数学",
    data: {
      math: { label: "数学排版" },
      latin: { label: "Latin 字体" },
      han: { label: "中文字体" },
      rule: {
        label: "中西共用标点",
        options: [
          {
            label: "中文字体",
            key: FallbackRule.HanFirst,
          },
          {
            label: "Latin 字体",
            key: FallbackRule.LatinFirst,
          },
          {
            label: "数学公式无中文标点",
            key: FallbackRule.HanOnlyIdeographs,
          },
        ],
        validate: build_validator(() => {
          const f = font.math;
          if (f.han === f.latin) {
            return { status: "irrelevant", feedback: "中西字体统一，无需设置" };
          }
          switch (f.rule) {
            case FallbackRule.HanFirst:
              return { status: "success" };
            case FallbackRule.LatinFirst:
              return { status: "success" };

            case FallbackRule.HanOnlyIdeographs:
              return {
                status: "warning",
                feedback:
                  "可能导致逗号、括号等中文独占标点变成□，建议改选“Latin 字体”",
              };
          }
        }),
      },
    },
  },
}));
</script>

<template>
  <n-config-provider :theme="theme">
    <main>
      <n-h1>Typst set font</n-h1>
      <div class="lg:grid lg:grid-cols-2 lg:gap-x-8">
        <section class="prose">
          <n-h2>基础字体设置</n-h2>
          <p>保证全文字体都基本正常，不会随机回落或出现豆腐块。</p>
          <n-card
            v-for="(category, category_key) in config"
            v-bind:key="category_key"
            :title="category.label"
            class="my-3"
          >
            <n-form-item
              v-for="(it, key) in category.data"
              :key="key"
              :label="it.label"
              label-placement="left"
              label-width="7em"
              :validation-status="it.validate?.status"
              :feedback="it.validate?.feedback"
            >
              <n-radio-group
                v-if="it.options"
                v-model:value="font[category_key][key]"
                :disabled="it.validate?.disabled"
              >
                <n-radio-button
                  v-for="{ key, label } in it.options"
                  :key="key"
                  :value="key"
                  :label="label"
                />
              </n-radio-group>
              <n-input
                v-else
                v-model:value="font[category_key][key]"
                :disabled="it.validate?.disabled"
                type="text"
              />
            </n-form-item>
          </n-card>
        </section>
        <aside>
          <FontFamiliesSample :font="font.text" />
          <n-h2>Typst 代码</n-h2>
          <pre
            class="prose"
          ><code class="block overflow-x-auto max-w-4xs">{{ stringify_FontSet(font, { mode: "markup" }) }}</code></pre>
        </aside>
      </div>
    </main>
  </n-config-provider>
</template>
