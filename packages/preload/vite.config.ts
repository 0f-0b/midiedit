import eslint from "@rollup/plugin-eslint";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig, Plugin } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

function preprocessor(plugin: Plugin): Plugin {
  return { ...plugin, enforce: "pre" };
}

export default defineConfig(({ command }) => ({
  root: "./packages/preload",
  plugins: [
    command === "build" ? preprocessor(eslint({ include: ["./packages/preload/src/**/*.ts"] })) : [],
    reactRefresh(),
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
      external: ["electron"],
      output: {
        entryFileNames: "index.cjs"
      }
    },
    brotliSize: false
  }
}));
