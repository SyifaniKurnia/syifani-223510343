import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  css: {
    devSourcemap: true,
  },
  plugins: [vue()],
});
