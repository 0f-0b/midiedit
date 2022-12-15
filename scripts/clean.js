#!/usr/bin/env node

import fs from "node:fs/promises";
import process from "node:process";
import { fileURLToPath } from "node:url";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
await fs.rm("dist", { recursive: true, force: true });
await fs.rm("packages/main/dist", { recursive: true, force: true });
await fs.rm("packages/preload/dist", { recursive: true, force: true });
await fs.rm("packages/renderer/dist", { recursive: true, force: true });
