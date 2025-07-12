<script setup lang="ts">
import { NButton, NRadioButton, NRadioGroup } from "naive-ui";
import { pretty_print_wasm } from "typstyle-core";
import { computed, ref } from "vue";
import { calc_advanced, stringify_advanced } from "../fonts/advanced.ts";
import { stringify_FontSet } from "../fonts/as_typst.ts";
import { resolve_FontSet } from "../fonts/resolve.ts";
import { FontSetAdvanced } from "../fonts/types.ts";

const { font } = defineProps<{
  font: FontSetAdvanced;
}>();

const mode = ref<"markup" | "code">("markup");

const remove_prefix = (str: string, prefices: string[]): string =>
  prefices.reduce(
    (s, prefix) => (s.startsWith(prefix) ? s.slice(prefix.length) : s),
    str,
  );
const remove_suffix = (str: string, suffix: string[]): string =>
  suffix.reduce(
    (s, suffix) => (s.endsWith(suffix) ? s.slice(0, -suffix.length) : s),
    str,
  );

const code = computed(() => {
  const raw = stringify_FontSet(resolve_FontSet(font), {
    mode: mode.value,
    afterwords: stringify_advanced(calc_advanced(font)),
  });

  if (!raw) {
    return "// 未设置字体";
  }

  return mode.value === "markup"
    ? pretty_print_wasm(raw, 60).trim()
    : remove_suffix(
        remove_prefix(pretty_print_wasm("#{" + raw + "}", 62).trim(), [
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
