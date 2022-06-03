import { execFile } from "child_process";
import packager from "electron-packager";

execFile("git", ["rev-parse", "--short=7", "HEAD"], (err, stdout) => void packager({
  dir: ".",
  out: "dist",
  overwrite: true,
  ignore: /(?:\/(?:.editorconfig|.eslintrc.json|tsconfig.eslint.json|tsconfig.json|vite.config.ts|.gitignore|README.md|src|scripts|icons)|.map)$/,
  asar: true,
  appCopyright: "Copyright (c) 2022 ud2",
  buildVersion: err ? "unknown" : stdout.trim(),
  appBundleId: "ud2.midiedit",
  appCategoryType: "public.app-category.music"
}));
