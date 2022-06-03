import child_process from "child_process";
import packager from "electron-packager";

child_process.execFile("git", ["rev-parse", "--short=7", "HEAD"], (err, stdout) => void packager({
  dir: ".",
  out: "dist",
  overwrite: true,
  ignore: /(?:\/(?:.editorconfig|.eslintrc.json|tsconfig.eslint.json|tsconfig.json|vite.config.ts|.gitignore|README.md|src|scripts|icons)|.map)$/,
  asar: true,
  appCopyright: "Copyright (c) 2021 sjx233",
  buildVersion: err ? "unknown" : stdout.trim(),
  appBundleId: "com.sjx233.midiedit",
  appCategoryType: "public.app-category.music"
}));
