import { promises as fs } from "fs";
import * as vite from "vite";

(async () => {
  for (const name of await fs.readdir("packages")) {
    console.group(name);
    await vite.build({
      configFile: `packages/${name}/vite.config.ts`
    });
    console.groupEnd();
  }
})().catch(() => process.exit(1));
