<script setup lang="ts">
import { NRadioButton, NRadioGroup } from "naive-ui";
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
  stringify_FontSet(resolve_FontSet(font), {
    mode: mode.value,
    afterwords: stringify_advanced(calc_advanced(font)),
  }),
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
      code || "// 未设置字体"
    }}</code></pre>
  </div>
</template>
