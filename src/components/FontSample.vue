<script setup lang="ts">
import type { FontName } from "../fonts/types.ts";

defineProps<{
  font: FontName;
  text: string;
}>();
</script>

<!-- Note: It is hard to `set text(fallback: false)` in Web. The result is not really predictable. -->
<template>
  <div
    class="rounded bg-slate-50 px-4 py-1 text-center shadow dark:bg-slate-800"
    :style="{ fontFamily: font }"
  >
    {{ text }}
  </div>
</template>
