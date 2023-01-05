import createEslintPlugin from "@rollup/plugin-eslint";
import createReactPlugin from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

function pre(plugin: Plugin): Plugin {
  return { ...plugin, enforce: "pre" };
}

export default defineConfig({
  root: "./packages/renderer",
  base: "",
  plugins: [
    pre(createEslintPlugin({
      include: [
        "./packages/renderer/src/**/*.ts",
        "./packages/renderer/src/**/*.tsx",
      ],
    })),
    createReactPlugin(),
    createHtmlPlugin(),
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
