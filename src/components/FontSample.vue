<script setup lang="ts">
import type { FontName } from "../fonts/types.ts";

defineProps<{
  font: FontName | null;
  text: string;
  /** Pre-rendered SVG */
  svg: string | null | undefined;
}>();
</script>

<!-- Note: It is hard to `set text(fallback: false)` in Web. The result is not really predictable. -->
<template>
  <div class="grid grid-cols-2 text-center">
    <div>{{ font ?? "随机字体或豆腐块" }}</div>
    <div
      v-if="svg"
      class="grid place-content-center rounded bg-slate-50 px-4 py-1 shadow dark:bg-slate-800"
      v-html="svg"
    />
    <div
      v-else
      class="content-center rounded bg-slate-50 px-4 py-1 shadow dark:bg-slate-800"
      :style="{ fontFamily: font ?? '' }"
    >
      {{ font !== null ? text : text.replaceAll(/./g, "□") }}
    </div>
  </div>
</template>
