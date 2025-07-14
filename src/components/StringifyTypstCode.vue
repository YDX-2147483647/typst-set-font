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

// Use a fake `pretty_print` before typstyle is loaded
const pretty_print = ref<(content: string, width: number) => string>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (content, _width) => content,
);
import("typstyle-core").then(({ pretty_print_wasm }) => {
  pretty_print.value = pretty_print_wasm;
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

  return mode.value === "markup"
    ? pretty_print.value(raw, 60).trim()
    : remove_suffix(
        remove_prefix(pretty_print.value("#{" + raw + "}", 62).trim(), [
          "#{\n",
          "#{ ",
        ]),
        ["\n}", " }"],
      )
        .split("\n")
        .map((line) => remove_prefix(line, ["  "]))
        .join("\n");
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
