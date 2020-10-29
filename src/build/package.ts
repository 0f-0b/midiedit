import * as childProcess from "child_process";
import * as path from "path";
import packager = require("electron-packager");

const root = path.resolve(__dirname, "../..");

childProcess.execFile("git", ["rev-parse", "--short=7", "HEAD"], (err, stdout) => packager({
  dir: root,
  out: "dist",
  overwrite: true,
  ignore: /(?:^\/(?:.editorconfig|.eslintrc.json|.gitignore|README.md|tsconfig.json|src|icons|lib\/build)|.d.ts|.map)$/,
  asar: true,
  appCopyright: "Copyright (c) 2020 sjx233",
  buildVersion: err ? "unknown" : stdout.trim(),
  appBundleId: "com.sjx233.midiedit",
  appCategoryType: "public.app-category.music"
}).catch(error => {
  process.stderr.write(`unexpected error: ${error?.stack ?? error}\n`);
  process.exit(1);
}));
