#!/usr/bin/env node

import process from "node:process";
import { fileURLToPath } from "node:url";
import { build } from "vite";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const mode = process.env.NODE_ENV || undefined;
await build({
  configFile: "packages/main/vite.config.ts",
  mode,
  define: {
    "process.env.VITE_DEV_SERVER_URL": "undefined",
  },
});
await build({
  configFile: "packages/preload/vite.config.ts",
  mode,
});
await build({
  configFile: "packages/renderer/vite.config.ts",
  mode,
});
