import eslint from "@rollup/plugin-eslint";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig, Plugin } from "vite";
import { minifyHtml } from "vite-plugin-html";

function preprocessor(plugin: Plugin): Plugin {
  return { ...plugin, enforce: "pre" };
}

function fixReactVirtualized(): Plugin {
  return {
    name: "fix-react-virtualized",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith("/node_modules/react-virtualized/dist/es/WindowScroller/utils/onScroll.js")) {
        return {
          code: code.replace("import { bpfrpt_proptype_WindowScroller } from \"../WindowScroller.js\";", ""),
          map: null
        };
      }
      return null;
    }
  };
}

export default defineConfig(({ command }) => ({
  root: "./packages/renderer",
  base: "",
  plugins: [
    command === "build" ? preprocessor(eslint({ include: ["./packages/renderer/src/**/*.ts", "./packages/renderer/src/**/*.tsx"] })) : [],
    fixReactVirtualized(),
    reactRefresh(),
    minifyHtml()
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
