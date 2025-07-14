<script setup lang="ts">
import readme from "../../README.md?raw";
import { markdownBlock } from "../markdown.ts";

const md = readme.replace(
  /^.+<!-- The following are used by SeeAlso.vue -->/s,
  "",
);
</script>

<template>
  <section>
    <h2>参考</h2>
    <div :class="$style.md" v-html="markdownBlock(md)"></div>
  </section>
</template>

<style module>
.md {
  a {
    &::after {
      content: "🔗";
      vertical-align: super;
      font-size: 0.75em;
      margin-left: 0.2em;
    }

    &:not(:hover) {
      text-decoration: none;
    }
  }
}
</style>
