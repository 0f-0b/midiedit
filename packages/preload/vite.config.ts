import eslint from "@rollup/plugin-eslint";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

function preprocessor(plugin: Plugin): Plugin {
  return { ...plugin, enforce: "pre" };
}

export default defineConfig(({ command }) => ({
  root: "./packages/preload",
  plugins: [
    command === "build"
      ? preprocessor(eslint({ include: ["./packages/preload/src/**/*.ts"] }))
      : [],
    react(),
    createHtmlPlugin(),
  ],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  build: {
    target: "es2020",
    sourcemap: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["electron"],
      output: {
        entryFileNames: "index.cjs",
      },
    },
    brotliSize: false,
  },
}));
