#!/usr/bin/env node

import fs from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @param {string} path
 * @returns {Promise<undefined>}
 */
async function remove(path) {
  console.log(`remove '${path}'`);
  await fs.rm(path, { recursive: true, force: true });
  return;
}

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
await remove("dist");
for (const name of await fs.readdir("packages")) {
  await remove(join("packages", name, "dist"));
}
