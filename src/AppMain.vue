<script setup lang="ts">
import {
  NButton,
  NCard,
  NFormItem,
  NH1,
  NH2,
  NInput,
  NRadioButton,
  NRadioGroup,
  NSwitch,
} from "naive-ui";
import { computed, reactive, ref } from "vue";
import FontFamiliesSample from "./components/FontFamiliesSample.vue";
import SeeAlso from "./components/SeeAlso.vue";
import { stringify_FontSet } from "./fonts/as_typst.ts";
import { resolve_FontFamilies, resolve_FontSet } from "./fonts/resolve.ts";
import {
  FallbackRule,
  FontFamilies,
  FontSet,
  FontSet_empty,
  FontSetAdvanced,
  TYPST_FONT,
} from "./fonts/types.ts";
import { markdown, type Markdown } from "./markdown.ts";

const font = reactive(FontSet_empty());

function build_validator(
  fn: () => {
    status: "success" | "warning" | "error" | "irrelevant";
    feedback?: Markdown;
  },
): {
  status: "success" | "warning" | "error";
  disabled: boolean;
  feedback?: Markdown;
} {
  const { status, feedback } = fn();
  return {
    status: status === "irrelevant" ? "success" : status,
    disabled: status === "irrelevant",
    feedback,
  };
}

const common_config: Record<string, { label: string; value: string }[]> = {
  宋体: [
    { label: "中易", value: "SimSun" },
    { label: "Fandol", value: "FandolSong" },
    { label: "思源 Source Han", value: "Source Han Serif" },
    { label: "思源 Noto CJK", value: "Noto Serif CJK SC" },
  ],
  黑体: [
    { label: "中易", value: "SimHei" },
    { label: "Fandol", value: "FandolHei" },
    { label: "思源 Source Han", value: "Source Han Sans" },
    { label: "思源 Noto CJK", value: "Noto Sans CJK SC" },
  ],
  楷体: [
    { label: "中易", value: "KaiTi" },
    { label: "Fandol", value: "FandolKai" },
    { label: "霞鹜", value: "LXGW WenKai GB" },
  ],
  仿宋: [
    { label: "中易", value: "FangSong" },
    { label: "Fandol", value: "FandolFang R" },
    { label: "朱雀", value: "Zhuque Fangsong (technical preview)" },
  ],
};
const common_han = ref("");

const config = computed<
  Record<
    keyof FontSet,
    {
      label: string;
      description?: Markdown;
      data: Record<
        keyof Omit<FontFamilies, "rule">,
        {
          label: string;
          validate?: ReturnType<typeof build_validator>;
        } & (
          | { placeholder?: string } // text input
          | { options?: { label: string; key: string | number }[] } // radio
          | { default_checked: boolean; advanced: true } // checkbox
        )
      >;
    }
  >
>(() => ({
  text: {
    label: "正文",
    data: {
      latin: {
        label: "Latin 字体",
        placeholder: `留空表示默认，即 ${TYPST_FONT.text}`,
      },
      han: {
        label: "中文字体",
        placeholder: "留空表示不设置，通常回落到楷体，也可能随机或豆腐块",
      },
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
          const f = resolve_FontFamilies(font.text, "text");
          if (f === null || f.han === f.latin) {
            return { status: "irrelevant", feedback: "中西字体统一，无需设置" };
          }
          switch (f.rule) {
            case FallbackRule.HanFirst:
              return { status: "success" };
            case FallbackRule.LatinFirst:
              return {
                status: "warning",
                feedback:
                  "不建议，可选“中文字体”，并利用 [smartquote](https://typst.app/docs/reference/text/smartquote/) 输入 Latin 标点",
              };
            case FallbackRule.HanOnlyIdeographs:
              return {
                status: "warning",
                feedback: "可能导致逗号等中文独占标点变成□，建议改选“中文字体”",
              };
          }
        }),
      },
      list_marker_prefer_default: {
        label: "项目符号除外",
        default_checked: false,
        advanced: true,
        validate: build_validator(() => {
          const shared =
            "是否将字体设置排除无序列表的项目符号 [list.marker](https://typst.app/docs/reference/model/list/#parameters-marker)——";

          const f = resolve_FontFamilies(font.text, "text");
          if (f === null || f.latin === TYPST_FONT.text) {
            return {
              status: "irrelevant",
              feedback:
                shared + "现在 list.marker 已采用 Typst 默认字体，无需专门排除",
            };
          } else {
            return {
              status: "success",
              feedback:
                shared +
                "思源宋体 SC/TC/HK 等字体的 •‣– 太小，不适合用于 list.marker，可开启此项恢复 Typst 默认字体",
            };
          }
        }),
      },
    },
  },
  code: {
    label: "代码",
    description: "代码指 [raw](https://typst.app/docs/reference/text/raw/)。",
    data: {
      latin: {
        label: "Latin 字体",
        placeholder: `留空表示默认，即 ${TYPST_FONT.code}`,
      },
      han: {
        label: "中文字体",
        placeholder: "留空表示不设置，通常回落到隶书或楷体，也可能随机或豆腐块",
      },
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
          const f = resolve_FontFamilies(font.code, "code");
          if (f === null || f.han === f.latin) {
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
    description:
      '数学指 [math.equation](https://typst.app/docs/reference/math/equation/)。以下“数学排版”指其中变量、分式、积分号等，而“中文”“Latin”指其中用 ""包裹起来的文本。',
    data: {
      math: {
        label: "数学排版",
        placeholder: `留空表示默认，即 ${TYPST_FONT.math}`,
      },
      latin: {
        label: "Latin 字体",
        placeholder: "留空表示使用数学排版字体",

        validate: build_validator(() => {
          const f = resolve_FontFamilies(font.math, "math");
          if (f === null) {
            return { status: "success" };
          }

          if (f.latin === f.math && f.latin !== f.han) {
            return {
              status: "warning",
              feedback:
                "可能遇到 [typst#6566](https://github.com/typst/typst/issues/6566)，建议数学排版字体加“Math”后缀，而 Latin 字体不加",
            };
          }
          if (
            f.latin !== f.math &&
            f.latin.toLocaleLowerCase().includes(" Math".toLocaleLowerCase())
          ) {
            return {
              status: "warning",
              feedback:
                "选用数学字体用于文本，可能[一同替换数学排版的字体](https://forum.typst.app/t/what-is-the-designed-behaviour-of-font-covers-in-math-equations/5006)，建议删除“Math”后缀或换成“Sans”或“Serif”",
            };
          }
          return { status: "success" };
        }),
      },
      han: {
        label: "中文字体",
        placeholder: "留空表示不设置，通常回落到楷体，也可能随机或豆腐块",
      },
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
          const f = resolve_FontFamilies(font.math, "math");
          if (f === null || f.han === f.latin) {
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

const sample_category = ref<keyof FontSet>("text");

const typst_code_mode = ref<"markup" | "code">("markup");
</script>

<template>
  <main>
    <n-h1>Typst set font</n-h1>
    <div class="lg:grid lg:grid-cols-2 lg:gap-x-8">
      <section class="prose">
        <n-h2>基础字体设置</n-h2>
        <p>保证全文字体都稳定正常，不会随机回落或出现豆腐块。</p>
        <n-card title="一键统设中文字体" size="small">
          <p
            v-for="(options, font_style) in common_config"
            v-bind:key="font_style"
            class="flex gap-2"
          >
            <span class="inline-block content-center">{{ font_style }}</span>
            <n-button
              v-for="{ label, value } in options"
              :key="value"
              @click="
                common_han =
                  font.text.han =
                  font.code.han =
                  font.math.han =
                    value
              "
            >
              {{ label }}
            </n-button>
          </p>
          <n-form-item label="自行指定" label-placement="left">
            <n-input
              type="text"
              v-model:value="common_han"
              @input="
                font.text.han = font.code.han = font.math.han = common_han
              "
              :clearable="true"
              placeholder="可先单击按钮，再自行修改"
            />
          </n-form-item>
        </n-card>
        <n-card
          v-for="(category, category_key) in config"
          v-bind:key="category_key"
          :title="category.label"
          class="my-3 shadow"
          @input="sample_category = category_key"
        >
          <p
            v-if="category.description"
            class="mt-0"
            v-html="markdown(category.description)"
          />
          <n-form-item
            v-for="(it, key) in category.data"
            :key="key"
            :label="it.label"
            label-placement="left"
            label-width="7em"
            :validation-status="it.validate?.status"
          >
            <template #feedback>
              <span
                v-html="
                  it.validate?.feedback
                    ? markdown(it.validate?.feedback)
                    : undefined
                "
              />
            </template>
            <n-radio-group
              v-if="'options' in it && it.options"
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
            <n-switch
              v-else-if="
                'advanced' in it && it.advanced && 'default_checked' in it
              "
              v-model:value="
                (font as FontSetAdvanced)[
                  key as keyof FontSetAdvanced
                ] as boolean
              "
              :disabled="it.validate?.disabled"
              :default-value="it.default_checked"
            />
            <n-input
              v-else
              v-model:value="font[category_key][key]"
              :disabled="it.validate?.disabled"
              @input="
                if (key === 'han') {
                  common_han = '';
                }
              "
              :clearable="true"
              :placeholder="'placeholder' in it ? it.placeholder : ''"
              type="text"
            />
          </n-form-item>
        </n-card>
      </section>
      <aside class="prose">
        <div class="sticky top-2">
          <section>
            <n-h2>字体测试</n-h2>
            <n-radio-group v-model:value="sample_category">
              <n-radio-button
                v-for="(category, category_key) in config"
                v-bind:key="category_key"
                :value="category_key"
                :label="category.label"
              />
            </n-radio-group>
            <FontFamiliesSample
              :font="font[sample_category]"
              :category="sample_category"
            />
            <p>浏览器渲染效果可能与 Typst 不同；请以文字描述为准。</p>
          </section>
          <section>
            <n-h2>Typst 代码</n-h2>
            <n-radio-group v-model:value="typst_code_mode">
              <n-radio-button
                v-for="mode in ['markup', 'code']"
                :key="mode"
                :value="mode"
                :label="mode"
              />
            </n-radio-group>
            <pre><code class="block overflow-x-auto max-w-4xs">{{
              stringify_FontSet(resolve_FontSet(font), { mode: typst_code_mode }) || "// 未设置字体"
            }}</code></pre>
          </section>
        </div>
      </aside>
    </div>
    <div class="mt-8">
      <SeeAlso />
    </div>
  </main>
</template>
