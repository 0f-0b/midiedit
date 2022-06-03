import eslint from "@rollup/plugin-eslint";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

function preprocessor(plugin: Plugin): Plugin {
  return { ...plugin, enforce: "pre" };
}

export default defineConfig(({ command }) => ({
  root: "./packages/main",
  plugins: [
    command === "build" ? preprocessor(eslint({ include: ["./packages/main/src/**/*.ts"] })) : [],
    react(),
    createHtmlPlugin()
  ],
  css: {
    modules: {
      localsConvention: "camelCaseOnly"
    }
  },
  build: {
    target: "es2020",
    sourcemap: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["electron", "fs/promises", "path"],
      output: {
        entryFileNames: "index.cjs"
      }
    },
    brotliSize: false
  }
}));
