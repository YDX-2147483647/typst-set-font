import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import postcssNesting from "postcss-nesting";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssNesting()],
    },
  },
  plugins: [tailwindcss(), vue()],
});
