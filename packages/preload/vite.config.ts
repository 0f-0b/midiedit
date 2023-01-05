import createEslintPlugin from "@rollup/plugin-eslint";
import { defineConfig, type Plugin } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

function pre(plugin: Plugin): Plugin {
  return { ...plugin, enforce: "pre" };
}

export default defineConfig({
  root: "./packages/preload",
  plugins: [
    pre(createEslintPlugin({ include: ["./packages/preload/src/**/*.ts"] })),
    createHtmlPlugin(),
  ],
  build: {
    target: "es2022",
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
    reportCompressedSize: false,
  },
});
