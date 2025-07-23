<script setup lang="ts">
import { NButton, NRadioButton, NRadioGroup } from "naive-ui";
import { computed, ref } from "vue";
import { calc_advanced, stringify_advanced } from "../fonts/advanced.ts";
import { stringify_FontSet } from "../fonts/as_typst.ts";
import { resolve_FontSet } from "../fonts/resolve.ts";
import { FontSetAdvanced } from "../fonts/types.ts";

const { font } = defineProps<{
  font: FontSetAdvanced;
}>();

const mode = ref<"markup" | "code">("markup");

// Use a fake `format_typst` before typstyle is loaded
const format_typst = ref<(text: string, mode: "markup" | "code") => string>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (text, _mode) => text,
);
import("@typstyle/typstyle-wasm-bundler").then(({ format }) => {
  const base_width = 60;
  format_typst.value = (text, mode) => {
    if (mode === "markup") {
      return format(text, { max_width: base_width }).trim();
    } else {
      const markup = format("#{" + text + "}", {
        max_width: base_width + 2, // Count the 2-space indent
      }).trim();

      const code = remove_suffix(remove_prefix(markup, ["#{\n", "#{ "]), [
        "\n}",
        " }",
      ])
        .split("\n")
        .map((line) => remove_prefix(line, ["  "]))
        .join("\n");

      return code;
    }
  };
});

const remove_prefix = (str: string, prefixes: string[]): string =>
  prefixes.reduce(
    (s, prefix) => (s.startsWith(prefix) ? s.slice(prefix.length) : s),
    str,
  );
const remove_suffix = (str: string, suffixes: string[]): string =>
  suffixes.reduce(
    (s, suffix) => (s.endsWith(suffix) ? s.slice(0, -suffix.length) : s),
    str,
  );

const code = computed(() => {
  const raw = stringify_FontSet(resolve_FontSet(font), {
    mode: mode.value,
    postscript: stringify_advanced(calc_advanced(font)),
  });

  if (!raw) {
    return "// 未设置字体";
  }

  return format_typst.value(raw, mode.value);
});

const copy = () => {
  navigator.clipboard.writeText(code.value);
};
</script>

<template>
  <div>
    <p class="flex justify-between">
      <n-button @click="copy" primary>复制</n-button>
      <n-radio-group v-model:value="mode">
        <n-radio-button
          v-for="mode in ['markup', 'code']"
          :key="mode"
          :value="mode"
          :label="mode"
        />
      </n-radio-group>
    </p>
    <pre><code class="block overflow-x-auto max-w-4xs">{{
      code
    }}</code></pre>
  </div>
</template>
