<script setup lang="ts">
import { NRadioButton, NRadioGroup } from "naive-ui";
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

const code = computed(() =>
  pretty_print_wasm(
    stringify_FontSet(resolve_FontSet(font), {
      mode: mode.value,
      afterwords: stringify_advanced(calc_advanced(font)),
    }) || "// 未设置字体",
    80,
  ).trim(),
);
</script>

<template>
  <div>
    <n-radio-group v-model:value="mode">
      <n-radio-button
        v-for="mode in ['markup', 'code']"
        :key="mode"
        :value="mode"
        :label="mode"
      />
    </n-radio-group>
    <pre><code class="block overflow-x-auto max-w-4xs">{{
      code
    }}</code></pre>
  </div>
</template>
