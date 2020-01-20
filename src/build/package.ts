import * as childProcess from "child_process";
import * as path from "path";
import { promisify } from "util";
import packager = require("electron-packager");
import setLanguages = require("electron-packager-languages");

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
  ignore: [/^\/tsconfig.json$/, /^\/src($|\/)/, /^\/icons($|\/)/, /^\/lib\/build($|\/)/, /^\/.vscode($|\/)/],
  asar: true,
  appCopyright: "Copyright (c) 2020 sjx233",
  buildVersion,
  icon: path.join(root, "icons/icon"),
  appBundleId: "com.sjx233.midiedit",
  appCategoryType: "public.app-category.music",
  afterCopy: [setLanguages(["en", "zh_CN"])]
})).catch(error => {
  process.stderr.write(`unexpected error: ${error?.stack ?? error}\n`);
  process.exit(1);
});
