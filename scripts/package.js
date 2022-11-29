#!/usr/bin/env node

import packager from "electron-packager";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const execFileAsync = promisify(execFile);
const buildVersion = await (async () => {
  try {
    const { stdout } = await execFileAsync("git", [
      "rev-parse",
      "--short=7",
      "HEAD",
    ]);
    return stdout;
  } catch {
    return "unknown";
  }
})();
await packager({
  dir: ".",
  out: "dist",
  overwrite: true,
  ignore:
    /(?:\/(?:.editorconfig|.eslintrc.json|tsconfig.eslint.json|tsconfig.json|vite.config.ts|.gitignore|README.md|src|scripts|icons)|.map)$/,
  asar: true,
  appCopyright: "Copyright (c) 2022 ud2",
  buildVersion,
  appBundleId: "ud2.midiedit",
  appCategoryType: "public.app-category.music",
});
