import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import postcssNesting from "postcss-nesting";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssNesting()],
    },
  },
  plugins: [
    tailwindcss(),
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
      },
    }),
  ],
});
