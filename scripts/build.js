#!/usr/bin/env node

import fs from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
for (const name of await fs.readdir("packages")) {
  console.log(`build '${name}'`);
  await build({
    configFile: join("packages", name, "vite.config.ts"),
    mode: process.env.NODE_ENV || undefined,
  });
}
