const esbuild = require("esbuild");
const fs = require("fs/promises");

const isProd = process.env.NODE_ENV === "production";
void (async () => {
  const baseOptions = {
    bundle: true,
    sourcemap: true,
    minify: isProd,
    minifySyntax: true,
    treeShaking: true,
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
    }
  };

  await esbuild.build({
    ...baseOptions,
    entryPoints: ["src/main/index.ts"],
    outfile: "build/main.js",
    platform: "node",
    external: ["electron"]
  });
  await esbuild.build({
    ...baseOptions,
    entryPoints: ["src/renderer/app.tsx"],
    outfile: "build/renderer.js",
    platform: "browser"
  });
  if (isProd) {
    const minifyHtml = require("html-minifier").minify;
    const minifyCss = require("csso").minify;
    await fs.writeFile("build/index.html", minifyHtml(await fs.readFile("index.html", "utf8"), {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true
    }));
    const style = minifyCss(await fs.readFile("style.css", "utf8"), {
      sourceMap: true,
      filename: "../style.css"
    });
    await fs.writeFile("build/style.css", style.css + "/*# sourceMappingURL=style.css.map */");
    await fs.writeFile("build/style.css.map", style.map.toString());
  } else {
    await fs.copyFile("index.html", "build/index.html");
    await fs.copyFile("style.css", "build/style.css");
  }
})();
