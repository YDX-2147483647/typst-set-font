import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import postcssNesting from "postcss-nesting";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // https://vite.dev/guide/build.html#relative-base
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 600,
  },
  css: {
    postcss: {
      plugins: [postcssNesting()],
    },
  },
  plugins: [tailwindcss(), vue(), wasm(), topLevelAwait()],
  // wasm and topLevelAwait are required by typstyle-core.
});
