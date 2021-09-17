import { promises as fs } from "fs";
import * as vite from "vite";

(async () => {
  for (const name of await fs.readdir("packages")) {
    console.group(name);
    await vite.build({
      configFile: `packages/${name}/vite.config.ts`,
      mode: process.env.NODE_ENV || undefined
    });
    console.groupEnd();
  }
})().catch(e => {
  console.error(e);
  process.exit(1);
});
