import eslint from "@rollup/plugin-eslint";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

function preprocessor(plugin: Plugin): Plugin {
  return { ...plugin, enforce: "pre" };
}

export default defineConfig(({ command }) => ({
  root: "./packages/renderer",
  base: "",
  plugins: [
    command === "build" ? preprocessor(eslint({ include: ["./packages/renderer/src/**/*.ts", "./packages/renderer/src/**/*.tsx"] })) : [],
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
    brotliSize: false
  }
}));
