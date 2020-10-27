import * as childProcess from "child_process";
import * as path from "path";
import { promisify } from "util";
import packager = require("electron-packager");

const execFile = promisify(childProcess.execFile);

const root = path.resolve(__dirname, "../..");

async function getBuildVersion(): Promise<string> {
  try {
    return (await execFile("git", ["rev-parse", "HEAD"])).stdout.substring(0, 7);
  } catch (e) {
    return "unknown";
  }
}

getBuildVersion().then(buildVersion => packager({
  dir: root,
  out: "dist",
  overwrite: true,
  ignore: [/(?:^\/(?:.editorconfig|.eslintrc.json|.gitignore|README.md|tsconfig.json|src|icons|lib\/build)|.d.ts|.map)$/],
  asar: true,
  appCopyright: "Copyright (c) 2020 sjx233",
  buildVersion,
  appBundleId: "com.sjx233.midiedit",
  appCategoryType: "public.app-category.music"
})).catch(error => {
  process.stderr.write(`unexpected error: ${error?.stack ?? error}\n`);
  process.exit(1);
});
