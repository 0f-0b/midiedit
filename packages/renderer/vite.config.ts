import eslint from "@rollup/plugin-eslint";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { createHtmlPlugin as html } from "vite-plugin-html";

function enforcePre(plugin: Plugin): Plugin {
  return { ...plugin, enforce: "pre" };
}

export default defineConfig({
  root: "./packages/renderer",
  base: "",
  plugins: [
    enforcePre(eslint({
      overrideConfigFile: "./packages/renderer/.eslintrc.json",
      throwOnError: true,
      include: /\.tsx?$/,
    })),
    react(),
    html(),
  ],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  build: {
    target: "es2022",
    sourcemap: true,
    reportCompressedSize: false,
  },
});
