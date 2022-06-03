import fs from "fs/promises";
import vite from "vite";

for (const name of await fs.readdir("packages")) {
  console.group(name);
  await vite.build({
    configFile: `packages/${name}/vite.config.ts`,
    mode: process.env.NODE_ENV || undefined
  });
  console.groupEnd();
}
