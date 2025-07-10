<script setup lang="ts">
import type { FontName } from "../fonts/types.ts";

defineProps<{
  font: FontName | null;
  text: string;
}>();
</script>

<!-- Note: It is hard to `set text(fallback: false)` in Web. The result is not really predictable. -->
<template>
  <div class="grid grid-cols-2 text-center">
    <div>{{ font ?? "随机字体或豆腐块" }}</div>
    <div
      class="rounded bg-slate-50 px-4 py-1 shadow dark:bg-slate-800"
      :style="{ fontFamily: font }"
    >
      {{ text }}
    </div>
  </div>
</template>
