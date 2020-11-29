const esbuild = require("esbuild");

const baseOptions = {
  bundle: true,
  sourcemap: true,
  minify: process.env.NODE_ENV === "production",
  minifySyntax: true,
  treeShaking: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
  }
};

void esbuild.build({
  ...baseOptions,
  entryPoints: ["src/main/index.ts"],
  outfile: "build/main.js",
  platform: "node",
  external: ["electron"]
});
void esbuild.build({
  ...baseOptions,
  entryPoints: ["src/renderer/app.tsx"],
  outfile: "build/renderer.js",
  platform: "browser"
});
