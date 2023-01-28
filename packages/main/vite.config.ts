import eslint from "@rollup/plugin-eslint";
import { defineConfig, type Plugin } from "vite";

function enforcePre(plugin: Plugin): Plugin {
  return { ...plugin, enforce: "pre" };
}

export default defineConfig({
  root: "./packages/main",
  plugins: [
    enforcePre(eslint({
      overrideConfigFile: "./packages/main/.eslintrc.json",
      throwOnError: true,
    })),
  ],
  build: {
    target: "es2022",
    sourcemap: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["electron", /^node:/],
      output: {
        entryFileNames: "index.cjs",
      },
    },
    reportCompressedSize: false,
  },
});
