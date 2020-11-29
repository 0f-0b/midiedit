const childProcess = require("child_process");
const path = require("path");
const packager = require("electron-packager");

const root = path.resolve(__dirname, "..");

childProcess.execFile("git", ["rev-parse", "--short=7", "HEAD"], (err, stdout) => void packager({
  dir: root,
  out: "dist",
  overwrite: true,
  ignore: /(?:^\/(?:.editorconfig|.eslintrc.json|.gitignore|README.md|tsconfig.json|src|types|scripts|icons)|.map)$/,
  asar: true,
  appCopyright: "Copyright (c) 2020 sjx233",
  buildVersion: err ? "unknown" : stdout.trim(),
  appBundleId: "com.sjx233.midiedit",
  appCategoryType: "public.app-category.music"
}));
